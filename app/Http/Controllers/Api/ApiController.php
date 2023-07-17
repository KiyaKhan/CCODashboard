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
            "site"=> $request->site,
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
                "team"=>[
                    "team_name"=>$user->group->name,
                    "team_leader"=>$user->group->user->first_name.' '.$user->group->user->last
                ]
            ]], 201);
    }

    public function statuses(){
        return Status::whereNot('id',10)->get();
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
                'status_id'=>1,
            ]);
            AgentLog::create([
                'user_id'=>$user->id,
                'status_id'=>1,
                'agent_session_id'=>$session->id
            ]);
            User::find($user->id)->update([
                'status_id'=>1
            ]);
            $this->session_id=$session->id;
        });
        broadcast(new AgentLogInEvent($user));
        return [
            'accessToken'=>$accessToken->plainTextToken,
            'user'=>[
                'firstName'=>$user->first_name,
                'lastName'=>$user->last_name,
                'session_id'=>$this->session_id,
                "site"=>$user->site,
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

            AgentLog::create([
                'agent_session_id'=>$session_id,
                'user_id'=>$user->id,
                'status_id'=>10,
                'overtime_reason'=>$overtime_reason,
                'early_departure_reason'=>$early_departure_reason,
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


    public function teams(){
        return Team::select(['id',
        'user_id',
        'name'])->with(['team_leader:id,first_name,last_name,company_id'])->without(['user'])->get();
        
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
        DB::transaction(function () use ($user,$session_id,$status_id,$overtime_reason,$early_departure_reason) {
            $agent_session=AgentSession::where([
                'id'=>$session_id
            ])->first();

            AgentLog::create([
                'agent_session_id'=>$session_id,
                'user_id'=>$user->id,
                'status_id'=>$status_id,
                'overtime_reason'=>$overtime_reason,
                'early_departure_reason'=>$early_departure_reason,
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
