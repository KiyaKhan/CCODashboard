<?php

namespace App\Http\Controllers\Api;

use App\Events\AgentChangeStatusEvent;
use App\Events\AgentLogInEvent;
use App\Events\AgentLogOutEvent;
use App\Events\AgentRegisteredEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\APi\ApiPostRegisterRequest;
use App\Http\Requests\Api\ChangeStatusPostRequest;
use App\Models\AgentLog;
use App\Models\AgentSession;
use App\Models\AgentStatus;
use App\Models\Project;
use App\Models\Status;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ApiController extends Controller
{
    private $session_id;
    public function register(ApiPostRegisterRequest $request){
        $user=User::create([
            "company_id"=> $request->company_id,
            "first_name"=> $request->first_name,
            "last_name"=> $request->last_name,
            "team_id"=> $request->team_id,
            "project_id"=> $request->project_id,
            "site"=> $request->site,
            "shift_start"=> $request->shift_start,
            "shift_end"=> $request->shift_end,
            "status_id"=> 10,
            "password"=> Hash::make($request->password),
        ]);
        broadcast(new AgentRegisteredEvent($user));
        return response([
            'message'=>'Registration succesful',
            'user'=>[
                "company_id"=>$user->company_id,
                "first_name"=>$user->first_name,
                "last_name"=>$user->last_name,
                "site"=>$user->site,
                "shift_start"=> $user->shift_start,
                "shift_end"=> $user->shift_end,
                "team"=>[
                    "team_name"=>$user->group->name,
                    "team_leader"=>$user->group->user->first_name.' '.$user->group->user->last
                ],
                "project"=>$user->project->name
            ]], 201);
    }

    public function statuses(){
        return Status::whereNot('id',10)->get();
    }

    public function statuses_all(){
        return Status::all();
    }

    public function login(Request $request){
        $user=User::with(['group','group.user'])->where('company_id',$request->company_id)->first();
        if(!$user){
            return response('Agent Not Found', 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response('Invalid Password', 404);
        }

        $accessToken = $user->createToken($user->company_id);
        DB::transaction(function () use ($user) {
            $session=AgentSession::create([
                'user_id'=>$user->id,
                'status_id'=>13,
            ]);
            AgentLog::create([
                'user_id'=>$user->id,
                'status_id'=>13,
                'agent_session_id'=>$session->id,
                'is_log_in'=>1,
                'start'=>now()
            ]);
            User::find($user->id)->update([
                'status_id'=>13
            ]);
            $this->session_id=$session->id;
        });
        broadcast(new AgentLogInEvent($user));
        $current_session=AgentSession::find($this->session_id);
        return [
            'accessToken'=>$accessToken->plainTextToken,
            'user'=>[
                'user_id'=>$user->id,
                'firstName'=>$user->first_name,
                'lastName'=>$user->last_name,
                'login_time'=>$current_session->created_at,
                'session_id'=>$this->session_id,
                "site"=>$user->site,
                "project"=>$user->project->name,
                "shift_start"=> $user->shift_start,
                "shift_end"=> $user->shift_end,
                'team'=>[
                    'team_id'=>$user->group->id,
                    'name'=>$user->group->name,
                    'team_leader_first_name'=>$user->group->user->first_name,
                    'team_leader_last_name'=>$user->group->user->last_name
                ]
            ],
        ];



        
    }


    public function logout(Request $request){
        
        $session_to_end=AgentSession::where([
            'user_id'=>$request->user()->id,
            'id'=>$request->session_id
        ])->first();

        if(!$session_to_end){
            return response('Invalid Session ID', 404);
        }

        $user=$request->user();
        $session_id=$request->session_id;
        
        $overtime_reason=$request->overtime_reason;
        $early_departure_reason=$request->early_departure_reason;
        DB::transaction(function () use ($user,$session_id,$overtime_reason,$early_departure_reason) {
            $agent_session=AgentSession::where([
                'id'=>$session_id
            ])->first();

            $log=AgentLog::where('agent_session_id',$session_id)->orderBy('created_at','desc')->first();
            if($log){
                $log->update([
                    'end'=>now()
                ]);
            }

            AgentLog::create([
                'agent_session_id'=>$session_id,
                'user_id'=>$user->id,
                'status_id'=>10,
                'overtime_reason'=>$overtime_reason,
                'early_departure_reason'=>$early_departure_reason,
                'end'=>now()
            ]);
            
            $agent_session->update([
                'status_id'=>10,
            ]);

            User::find($user->id)->update([
                'status_id'=>10
            ]);
        });
        broadcast(new AgentLogOutEvent($request->user()));
        $request->user()->tokens()->delete();

        return 'Succesfully Logged Out!';
    }

    public function projects(){
        return Project::select(['id',
            'name'])
            ->get();
        
    }

    public function teams(){
        return Team::select(['id',
        'user_id',
        'name'])
        ->with(['team_leader:id,first_name,last_name,company_id'])->without(['user'])->get();
        
    }

    public function teams_and_projects(){
        return [
            'projects'=>Project::select(['id',
                'name'])
                ->get(),
            'teams'=>  Team::select(['id',
                'user_id',
                'name'])
                ->with(['team_leader:id,first_name,last_name,company_id'])->without(['user'])->get()
        ];
    }


    public function change_status(ChangeStatusPostRequest $request){
        $session_to_edit=AgentSession::where([
            'user_id'=>$request->user()->id,
            'id'=>$request->session_id
        ])->first();

        if(!$session_to_edit){
            return response('Invalid Session ID', 404);
        }

        if(strval($request->status_id)=='10'){
            return response('Invalid Status ID', 404);
        }

        $user=$request->user();
        $session_id=$request->session_id;
        $status_id=$request->status_id;
        $overtime_reason=$request->overtime_reason;
        $early_departure_reason=$request->early_departure_reason;
        $special_project_remark=$request->special_project_remark;
        DB::transaction(function () use ($user,$session_id,$status_id,$overtime_reason,$early_departure_reason,$special_project_remark) {
            $agent_session=AgentSession::where([
                'id'=>$session_id
            ])->first();

            $log=AgentLog::where('agent_session_id',$session_id)->orderBy('created_at','desc')->first();
            if($log){
                $log->update([
                    'end'=>now()
                ]);
            }
            

            AgentLog::create([
                'agent_session_id'=>$session_id,
                'user_id'=>$user->id,
                'status_id'=>$status_id,
                'overtime_reason'=>$overtime_reason,
                'early_departure_reason'=>$early_departure_reason,
                'special_project_remark'=>$special_project_remark,
                'start'=>now()
            ]);
            
            $agent_session->update([
                'status_id'=>$status_id,
            ]);

            User::find($user->id)->update([
                'status_id'=>$status_id
            ]);
        });
        
        $log=AgentLog::with(['status'])
            ->select(['id','status_id','agent_session_id as session_id','created_at as start_time'])
            ->where('user_id',$user->id)
            ->where('agent_session_id',$session_id)
            ->orderBy('created_at','desc')->get();

        broadcast(new AgentChangeStatusEvent($user,$status_id));
        return [
            'activity_log'=>$log,
            'user'=>$user->only(['id','first_name','last_name','company_id']),
            'current_activity'=>$log[0]
        ];
        
    }
}
