<?php

namespace App\Http\Controllers\Api;

use App\Events\AgentChangeStatusEvent;
use App\Events\AgentLogEvent;
use App\Events\AgentLogInEvent;
use App\Events\AgentLogOutEvent;
use App\Events\AgentRegisteredEvent;
use App\Events\CallEmailLogEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\APi\ApiPostRegisterRequest;
use App\Http\Requests\Api\ChangeStatusPostRequest;
use App\Http\Requests\Api\EndLoggingPostRequest;
use App\Http\Requests\Api\LoggingPostRequest;
use App\Models\AgentLog;
use App\Models\AgentSession;
use App\Models\AgentStatus;
use App\Models\CallEmailLog;
use App\Models\Driver;
use App\Models\Positions;
use App\Models\Project;
use App\Models\Status;
use App\Models\Team;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ApiController extends Controller
{
    private $session_id;
    public function register(ApiPostRegisterRequest $request)
    {
        $user = User::create([
            "company_id" => $request->company_id,
            "first_name" => $request->first_name,
            "last_name" => $request->last_name,
            "team_id" => $request->team_id,
            "project_id" => $request->project_id,
            "site" => $request->site,
            "shift_start" => $request->shift_start,
            "shift_end" => $request->shift_end,
            "status_id" => 10,
            "password" => Hash::make($request->password),
        ]);
        broadcast(new AgentRegisteredEvent($user));
        return response([
            'message' => 'Registration succesful',
            'user' => [
                "company_id" => $user->company_id,
                "first_name" => $user->first_name,
                "last_name" => $user->last_name,
                "site" => $user->site,
                "shift_start" => $user->shift_start,
                "shift_end" => $user->shift_end,
                "team" => [
                    "team_name" => $user->group->name,
                    "team_leader" => $user->group->user->first_name . ' ' . $user->group->user->last
                ],
                "project" => $user->project->name
            ]
        ], 201);
    }
    public function forgotPassword(Request $request)
    {
        $user = User::where('company_id', $request->company_id)
            ->where('last_name', $request->last_name)
            ->where('site', $request->site)->first();
        if (!$user) return response('Agent Not Found', 404);
        try {
            $ID = Str::upper($user->company_id);
            $LN = Str::lower(
                Str::replace([' ', 'ñ', 'Ñ'], ['', 'n', 'N'], $user->last_name)
            );
            $user->password = Hash::make($ID . "_" . $LN);
            $user->save();
            return response('Password Reset Successful!');
        } catch (Exception $ex) {
            return response()->json([
                'status' => 500,
                'error' => $ex->getMessage()
            ], 500);
        }
    }
    public function statuses($project_id = null)
    {
        $dataset = Status::whereNot('id', 10)->orderBy('position', 'asc');
        $count = (clone $dataset)->where('project_id', $project_id)->count();
        if ($count < 1) {
            return (clone $dataset)->whereNull('project_id')->get();
        }
        return (clone $dataset)->where('project_id', $project_id)->get();
    }

    public function statuses_all($project_id = null)
    {
        return Status::when($project_id, function ($status) use ($project_id) {
            $status->where('project_id', $project_id);
        })
            ->when(!$project_id, function ($query) {
                $query->whereNull('project_id');
            })
            ->orderBy('position', 'asc')
            ->get();
    }

    public function login(Request $request)
    {
        $user = User::with(['group', 'group.user'])->where('company_id', $request->company_id)->first();
        if (!$user) {
            return response('Agent Not Found', 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response('Invalid Password', 404);
        }

        $accessToken = $user->createToken($user->company_id);
        DB::transaction(function () use ($user) {
            $session = AgentSession::create([
                'user_id' => $user->id,
                'status_id' => 13,
            ]);
            AgentLog::create([
                'user_id' => $user->id,
                'status_id' => 13,
                'agent_session_id' => $session->id,
                'is_log_in' => 1,
                'start' => now()
            ]);
            User::find($user->id)->update([
                'status_id' => 13
            ]);
            $this->session_id = $session->id;
        });
        broadcast(new AgentLogInEvent($user));
        $current_session = AgentSession::find($this->session_id);
        return [
            'accessToken' => $accessToken->plainTextToken,
            'user' => [
                'user_id' => $user->id,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'login_time' => $current_session->created_at,
                'session_id' => $this->session_id,
                "site" => $user->site,
                "project" => $user->project->name ?? 'No Project Assigned',
                "project_id" => $user->project->id ?? 0,
                "shift_start" => $user->shift_start,
                "shift_end" => $user->shift_end,
                'team' => [
                    'team_id' => $user->group->id ?? 0,
                    'name' => $user->group->name ?? 'No Team Assigned',
                    'team_leader_first_name' => $user->group->user->first_name ?? 'No Team Assigned',
                    'team_leader_last_name' => $user->group->user->last_name ?? 'No Team Assigned'
                ]
            ],
        ];
    }

    public function logout(Request $request)
    {

        $session_to_end = AgentSession::where([
            'user_id' => $request->user()->id,
            'id' => $request->session_id
        ])->first();

        if (!$session_to_end) {
            return response('Invalid Session ID', 404);
        }

        $user = $request->user();
        $session_id = $request->session_id;

        $overtime_reason = $request->overtime_reason;
        $early_departure_reason = $request->early_departure_reason;
        DB::transaction(function () use ($user, $session_id, $overtime_reason, $early_departure_reason) {
            $agent_session = AgentSession::where([
                'id' => $session_id
            ])->first();

            $log = AgentLog::where('agent_session_id', $session_id)->orderBy('created_at', 'desc')->first();
            if ($log) {
                $log->update([
                    'end' => now()
                ]);
            }

            AgentLog::create([
                'agent_session_id' => $session_id,
                'user_id' => $user->id,
                'status_id' => 10,
                'overtime_reason' => $overtime_reason,
                'early_departure_reason' => $early_departure_reason,
                'end' => now()
            ]);

            $agent_session->update([
                'status_id' => 10,
            ]);

            User::find($user->id)->update([
                'status_id' => 10
            ]);
        });
        broadcast(new AgentLogOutEvent($request->user()));
        $request->user()->tokens()->delete();

        return 'Succesfully Logged Out!';
    }

    public function projects()
    {
        return Project::select([
            'id',
            'name'
        ])
            ->get();
    }

    public function teams()
    {
        return Team::select([
            'id',
            'user_id',
            'name'
        ])
            ->with(['team_leader:id,first_name,last_name,company_id'])->without(['user'])->get();
    }

    public function teams_and_projects()
    {
        return [
            'projects' => Project::select([
                'id',
                'name'
            ])
                ->get(),
            'teams' =>  Team::select([
                'id',
                'user_id',
                'name'
            ])
                ->with(['team_leader:id,first_name,last_name,company_id'])->without(['user'])->get()
        ];
    }
    public function positions()
    {
        return response()->json(Positions::all());
    }

    public function change_status(ChangeStatusPostRequest $request)
    {
        $session_to_edit = AgentSession::where([
            'user_id' => $request->user()->id,
            'id' => $request->session_id
        ])->first();

        if (!$session_to_edit) {
            return response('Invalid Session ID', 404);
        }

        if (strval($request->status_id) == '10') {
            return response('Invalid Status ID', 404);
        }

        $user = $request->user();
        $session_id = $request->session_id;
        $status_id = $request->status_id;
        $overtime_reason = $request->overtime_reason;
        $early_departure_reason = $request->early_departure_reason;
        $special_project_remark = $request->special_project_remark;
        DB::transaction(function () use ($user, $session_id, $status_id, $overtime_reason, $early_departure_reason, $special_project_remark) {
            $agent_session = AgentSession::where([
                'id' => $session_id
            ])->first();

            $log = AgentLog::where('agent_session_id', $session_id)->orderBy('created_at', 'desc')->first();
            if ($log) {
                $log->update([
                    'end' => now()
                ]);
            }


            AgentLog::create([
                'agent_session_id' => $session_id,
                'user_id' => $user->id,
                'status_id' => $status_id,
                'overtime_reason' => $overtime_reason,
                'early_departure_reason' => $early_departure_reason,
                'special_project_remark' => $special_project_remark,
                'start' => now()
            ]);

            $agent_session->update([
                'status_id' => $status_id,
            ]);

            User::find($user->id)->update([
                'status_id' => $status_id
            ]);
        });

        $log = AgentLog::with(['status'])
            ->select(['id', 'status_id', 'agent_session_id as session_id', 'created_at as start_time'])
            ->where('user_id', $user->id)
            ->where('agent_session_id', $session_id)
            ->orderBy('created_at', 'desc')->get();

        broadcast(new AgentChangeStatusEvent($user, $status_id));
        return [
            'activity_log' => $log,
            'user' => $user->only(['id', 'first_name', 'last_name', 'company_id']),
            'current_activity' => $log[0]
        ];
    }

    public function drivers($project_id = null)
    {
        $count = Driver::where('project_id', $project_id)->count();
        #Return Default if no Custom
        if ($count < 1) {
            return Driver::select(['driver', 'project_id'])
                ->whereNull('project_id')
                ->orderBy('position', 'asc')
                ->get();
        }
        $response = Driver::select(['driver', 'project_id', 'id'])
            ->where('project_id', $project_id)
            ->orderBy('position', 'asc')
            ->get();
        return $response;
    }
    public function driversByProject()
    {
        $projects = Project::all();
        $drivers = Driver::all()->groupBy('project_id');
        $response = [];
        foreach ($projects as $project) {
            if (isset($drivers[$project->id])) {
                $response[$project->name] = $drivers[$project->id];
            }
        }
        return response()->json($response);
    }

    public function start_log(LoggingPostRequest $request)
    {
        $log = CallEmailLog::create([
            'agent_session_id' => $request->session_id,
            'type' => $request->type,
            'driver' =>  $request->driver,
            'driver_id' =>  $request->driver_id,
            'user_id' => $request->user()->id,
            'phone_or_email' => $request->phone_or_email,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time
        ]);
        $log->load(['user', 'driver_obj']);
        broadcast(new CallEmailLogEvent($log, $request->user()));
        return [
            'log_id' => $log->id,
            'type' => $log->type,
            'driver' => $log->driver,
            'session_id' => $log->agent_session_id,
            'start_time' => $log->start_time,
            'end_time' =>  $log->end_time,
        ];
    }

    public function end_log(EndLoggingPostRequest $request)
    {
        $now = now();
        $log = CallEmailLog::where('agent_session_id', $request->session_id)->where('id', $request->log_id)->first();
        $log->update([
            'updated_at' => $now
        ]);
        broadcast(new CallEmailLogEvent($log, $request->user()));
        return ['message' => 'Done!', 'End Time' => $now];
    }
}
