<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AgentLog;
use App\Models\Status;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeamController extends Controller
{
    
    
    public function index()
    {
        return Inertia::render('Teams',[
            'teams'=>Team::with(['user','users'])->get(),
            'available_team_leaders'=>User::where('user_level',2)->doesnthave('team')->get()
        ]);
    }

    
    public function create()
    {
        //
    }

    
    public function store(Request $request)
    {
        $user=User::findOrFail($request->agent['id']);
        $name = $request->team_name;

        DB::transaction(function () use($user,$name) {
            $new_team = Team::create([
                'name'=>$name,
                'user_id'=>$user->id
            ]);
    
            $user->update([
                'team_id'=>$new_team->id,
                'user_level'=>2
            ]);
            
        });

        
    }

    
    public function show($id)
    {
        //
    }

    
    public function edit(Request $request)
    {
        
    }

    
    public function update(Request $request)
    {
        
        $team_id=$request->team_id;
        $new_leader_id=$request->TL['id']??null;
        $name=$request->name;

        
        if(isset($new_leader_id)){
            DB::transaction(function() use($new_leader_id,$team_id) {
                $team=Team::findOrFail($team_id);
                $old_leader=User::findOrFail($team->user_id);
                $new_leader=User::findOrFail($new_leader_id);
                $team->update([
                    'user_id'=>$new_leader_id
                ]);
                $old_leader->update([
                    'user_level'=>3
                ]);
                $new_leader->update([
                    'user_level'=>2
                ]);
            });
            
        }

        if(isset($name)){
            $team=Team::findOrFail($team_id);
            $team->update([
                'name'=>$name
            ]);
        }
    }

    
    public function destroy($id)
    {
        //
    }

    public function reports(Request $request){
        $from=Carbon::parse($request->date['from'])->format('Y-m-d');
        $to=isset($request->date['to'])?Carbon::parse($request->date['to'])->addDay()->format('Y-m-d'):null;
        $team_id=$request->team_id;
        $agents=User::when($team_id,function($q) use($team_id){
            $q->where('team_id',$team_id);
        })->get();

        

        $report_items = array();

        foreach($agents as $agent){
            $session_ids_with_logout_only = AgentLog::distinct()->where('status_id',10)->get(['agent_session_id']);
            $agent_logs = AgentLog::where('user_id',$agent->id)
                ->where('created_at','>=',$from)
                ->when($to,function($q) use($to){
                    $q->where('created_at','<=',$to);
                })
                ->whereIn('agent_session_id',$session_ids_with_logout_only)
                ->orderBy('agent_session_id','asc')
                ->orderBy('created_at','asc')
                ->get();
            $breakdown=[
                'calls'=>0, //1
                'emails'=>0,//2
                'break'=>0,//3
                'bio_break'=>0,//4
                'lunch'=>0,//5
                'training'=>0,//6
                'coaching'=>0,//7
                'meeting'=>0,//8
                'system_issue'=>0,//9
                'floor_support'=>0,//11
                'special_assignment'=>0,//12
                'not_ready'=>0//13
            ];
            
            for($i=0;$i<count($agent_logs);$i++){
                $current_item=$agent_logs[$i];
                $next_index=$i+1;
                $next_item=isset($agent_logs[$next_index])?$agent_logs[$next_index]:null;
                //dd([$current_item,$next_item]);
                if(!isset($agent_logs[$next_index])){continue;}
                if($current_item->status_id==1){
                    $breakdown['calls'] = $breakdown['calls'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==2){
                    $breakdown['emails'] = $breakdown['emails'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==3){
                    $breakdown['break'] = $breakdown['break'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==4){
                    $breakdown['bio_break'] = $breakdown['bio_break'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==5){
                    $breakdown['lunch'] = $breakdown['lunch'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==6){
                    $breakdown['training'] = $breakdown['training'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==7){
                    $breakdown['coaching'] = $breakdown['coaching'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==8){
                    $breakdown['meeting'] = $breakdown['meeting'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==9){
                    $breakdown['system_issue'] = $breakdown['system_issue'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==11){
                    $breakdown['floor_support'] = $breakdown['floor_support']  + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==12){
                    $breakdown['special_assignment'] = $breakdown['special_assignment'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==13){
                    $breakdown['not_ready'] = $breakdown['not_ready'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                
            }
            array_push($report_items,[
                'agent'=>$agent,
                'breakdown'=>$breakdown
            ]);
        }   
        

        return[
            'report_items'=>$report_items,
            'from'=>$from,
            'to'=>$to??Carbon::now()->format('Y-m-d')
        ];
    }

    public function overbreaks(Request $request){
        $team_id=$request->team_id;
        $agents=($team_id!=0&&$team_id)?User::select(['id'])->where('team_id',$team_id):null;

        $agent_logs = AgentLog::with(['user','status'])
            ->when(($team_id&&$team_id!=0), function($q) use($agents){
                $q->whereIn('user_id',$agents);
            })
            ->orderBy('agent_session_id','asc')
            ->orderBy('created_at','asc')
            ->get();


        $overbreaks = [];

        for($i=0;$i<count($agent_logs);$i++){
            $current_item=$agent_logs[$i];
            $next_index=$i+1;
            $next_item=isset($agent_logs[$next_index])?$agent_logs[$next_index]:null;
            //dd([$current_item,$next_item]);
            if(!isset($agent_logs[$next_index])){continue;}
            
            
            if($current_item->status_id==3){
                $break_duration = (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                $current_item['break_end']=$next_item->created_at;
                $current_item['break_duration']=$break_duration;
                if($break_duration>15){
                    array_push($overbreaks,$current_item);
                }
            }
            if($current_item->status_id==4){
                $break_duration = (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                $current_item['break_end']=$next_item->created_at;
                $current_item['break_duration']=$break_duration;
                if($break_duration>5){
                    array_push($overbreaks,$current_item);
                }
            }
            if($current_item->status_id==5){
                $break_duration = (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                $current_item['break_end']=$next_item->created_at;
                $current_item['break_duration']=$break_duration;
                if($break_duration>60){
                    array_push($overbreaks,$current_item);
                }
            }
            
            
        }

        
        return $overbreaks;

    }

    public function lates(Request $request){
        $team_id=$request->team_id;
        $agents=($team_id!=0&&$team_id)?User::select(['id'])->where('team_id',$team_id):null;

        $log_ins = AgentLog::with(['user','status'])
        ->when(($team_id&&$team_id!=0), function($q) use($agents){
            $q->whereIn('user_id',$agents);
        })
        ->where('status_id',13)
        ->where('is_log_in',1)
        ->orderBy('agent_session_id','asc')
        ->orderBy('created_at','asc')
        ->get();

        $lates =[];

        foreach($log_ins as $log_in){
            $log_in_date=Carbon::parse($log_in->created_at)->format('Y-m-d');
            $log_in_time=Carbon::parse($log_in->created_at)->format('H:i');

            $late_mins=Carbon::parse($log_in_time)->diffInMinutes(Carbon::parse($log_in->user->shift_start));
            $late_secs=$late_mins*60;
            $late_time = gmdate('H:i:s', $late_secs);
            if((Carbon::parse($log_in_time)<Carbon::parse($log_in->user->shift_start))){
                continue;
            }
            // if($late_mins>300){
            //     continue;
            // }

            

            array_push($lates,[
                'user_id'=>$log_in->user->id,
                'company_id'=>$log_in->user->company_id,
                'agent'=>$log_in->user->first_name.' '.$log_in->user->last_name,
                'log_in_date'=>$log_in_date,
                'log_in_time'=>$log_in_time,
                'shift_start'=>$log_in->user->shift_start,
                'shift_end'=>$log_in->user->shift_end,
                'late_mins'=>$late_mins,
                'late_time'=>$late_time
            ]);
        }

        

        return $lates;
    }

    
    
}

