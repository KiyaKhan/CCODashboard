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

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
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
                'team_id'=>$new_team->id
            ]);
        });

        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    
    public function edit(Request $request)
    {
        
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function reports(Request $request){
        $from=Carbon::parse($request->date['from'])->format('Y-m-d');
        $to=isset($request->date['to'])?Carbon::parse($request->date['to'])->format('Y-m-d'):null;

        $agents=User::where('team_id',$request->team_id)->get();

        

        $report_items = array();

        foreach($agents as $agent){
            $agent_logs = AgentLog::where('user_id',$agent->id)
                ->where('created_at','>=',$from)
                ->when($to,function($q) use($to){
                    $q->where('created_at','<=',$to);
                })
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
                'special_assignment'=>0//12
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
                if($current_item->agenstatus_idtstatus_id_session_id==9){
                    $breakdown['system_issue'] = $breakdown['system_issue'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==11){
                    $breakdown['floor_support'] = $breakdown['floor_support']  + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
                }
                if($current_item->status_id==12){
                    $breakdown['special_assignment'] = $breakdown['special_assignment'] + (int)Carbon::parse($next_item->created_at)->diffInMinutes(Carbon::parse($current_item->created_at));
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
}
