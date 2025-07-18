<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SyncIntranetData;
use App\Models\AgentLog;
use App\Models\CallEmailLog;
use App\Models\IntranetTeam;
use App\Models\IntranetUser;
use App\Models\Notification;
use App\Models\Positions;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AgentController extends Controller
{
    public function index(Request $request)
    {
        SyncIntranetData::dispatch();
        $filter = $request->filter;
        $status_id = $request->status_id;
        $team_id = $request->team_id;
        return User::with(['group', 'status'])
            ->where(function ($q) use ($filter) {
                $q->orWhere('company_id', 'like', '%' . $filter . '%')
                    ->orWhere('first_name', 'like', '%' . $filter . '%')
                    ->orWhere('last_name', 'like', '%' . $filter . '%');
            })
            ->when(($team_id != 0 || $team_id), function ($q) use ($team_id) {
                $q->where('team_id', $team_id);
            })
            ->whereNot('user_level', 1)
            ->when($status_id, function ($q) use ($status_id) {
                $q->where('status_id', $status_id);
            })
            ->get();
    }

    public function get_data(Request $request)
    {
        $team_id = $request->team_id;
        $singleDate = isset($filter['from']) && $filter['from'] === $filter['to'];
        $rangeDate = isset($filter['from']) && $filter['from'] !== $filter['to'];
        $recent_notifications = Notification::with(['user'])
            ->when($team_id != 0, function ($q) use ($team_id) {
                $q->where('team_id', $team_id);
            })->limit(5)->orderBy('created_at', 'desc')->get();
        $user = User::whereNot('user_level', 1)->whereNotNull('team_id')
            ->when($team_id != 0, function ($q) use ($team_id) {
                $q->where('team_id', $team_id);
            });
        $agent_logs = [];

        CallEmailLog::with(['user' => function ($query) {
            $query->select('id', 'first_name', 'last_name', 'project_id', 'company_id'); // 👈 Replace with desired columns
        }])
            ->when($team_id != 0, function ($q) use ($team_id) {
                $q->whereHas('user', function ($query) use ($team_id) {
                    $query->where('team_id', $team_id);
                });
            })
            ->orderBy('created_at', 'desc')
            ->chunk(100, function ($logsChunk) use (&$agent_logs) {
                foreach ($logsChunk as $log) {
                    $agent_logs[] = $log;
                }
            });
        return [
            'agent_logs' => $agent_logs,
            'recent_notifications' => $recent_notifications,
            'dashboard_cards' => [
                'team_size' => $user->count(),
                'total_online' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->whereNot('status_id', 10)->count(),
                'total_on_lunch_or_break' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->whereIn('status_id', [3, 4, 5])->count(),
                'total_on_call' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 1)->count(),
                'total_on_email' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 2)->count(),
            ],
            'bar_chart' => [
                ['name' => 'calls', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 1)->count()],
                ['name' => 'emails', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 2)->count()],
                ['name' => 'break', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 3)->count()],
                ['name' => 'bio_break', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 4)->count()],
                ['name' => 'lunch', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 5)->count()],
                ['name' => 'training', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 6)->count()],
                ['name' => 'coaching', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 7)->count()],
                ['name' => 'meeting', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 8)->count()],
                ['name' => 'system_issue', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 9)->count()],
                ['name' => 'floor_support', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 11)->count()],
                ['name' => 'special_assignment', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 12)->count()],
                ['name' => 'not_ready`', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                    ->when($team_id != 0, function ($q) use ($team_id) {
                        $q->where('team_id', $team_id);
                    })->where('status_id', 13)->count()],
            ]
        ];
    }


    public function get_card_data(Request $request)
    {
        $team_id = $request->team_id;
        $user = User::whereNot('user_level', 1)->whereNotNull('team_id')
            ->when($team_id != 0, function ($q) use ($team_id) {
                $q->where('team_id', $team_id);
            });
        return [
            'team_size' => $user->count(),
            'total_online' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->whereNot('status_id', 10)->count(),
            'total_on_lunch_or_break' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->whereIn('status_id', [3, 4, 5])->count(),
            'total_on_call' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 1)->count(),
            'total_on_email' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 2)->count(),
        ];
    }

    public function get_bar_chart_data(Request $request)
    {
        $team_id = $request->team_id;
        return [
            ['name' => 'calls', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 1)->count()],
            ['name' => 'emails', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 2)->count()],
            ['name' => 'break', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 3)->count()],
            ['name' => 'bio_break', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 4)->count()],
            ['name' => 'lunch', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 5)->count()],
            ['name' => 'training', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 6)->count()],
            ['name' => 'coaching', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 7)->count()],
            ['name' => 'meeting', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 8)->count()],
            ['name' => 'system_issue', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 9)->count()],
            ['name' => 'floor_support', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 11)->count()],
            ['name' => 'special_assignment', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 12)->count()],
            ['name' => 'not_ready', 'total' => User::whereNot('user_level', 1)->whereNotNull('team_id')
                ->when($team_id != 0, function ($q) use ($team_id) {
                    $q->where('team_id', $team_id);
                })->where('status_id', 13)->count()],
        ];
    }

    public function notifications(Request $request)
    {

        $team_id = $request->team_id;
        $date = $request->date;
        return Notification::with(['user'])
            ->when(($team_id || $team_id != 0), function ($q) use ($team_id) {
                $q->where('team_id', $team_id);
            })
            ->where('created_at', '>=', Carbon::parse($date)->subDay())
            ->where('created_at', '<=', Carbon::parse($date)->addDay())
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function new(Request $request)
    {
        $request->validate([
            'first_name' => ['string', 'max:255', 'required'],
            'last_name' => ['string', 'max:255', 'required'],
            'company_id' => ['string', 'max:255', 'unique:users', 'required'],
            'password' => ['string', 'required', 'min:6'],
            'shift_start' => ['date_format:H:i', 'required'],
            'shift_end' => ['date_format:H:i', 'required'],
            'project_id' => ['required', 'exists:App\Models\Project,id'],
            'team_id' => ['required', 'exists:App\Models\Team,id'],
            'site' => ['required', Rule::in(['Manila', 'Leyte'])]
        ]);

        User::create([
            "company_id" => $request->company_id,
            "first_name" => $request->first_name,
            "last_name" => $request->last_name,
            "team_id" => $request->team_id,
            "site" => $request->site,
            "shift_start" => $request->shift_start,
            "shift_end" => $request->shift_end,
            "project_id" => $request->project_id,
            "status_id" => 10,
            "password" => Hash::make($request->password),
        ]);
    }


    public function update(Request $request)
    {

        $request->validate([
            'id' => ['required', 'exists:App\Models\User,id'],
            'first_name' => ['string', 'max:255', 'required'],
            'last_name' => ['string', 'max:255', 'required'],
            //'name' => 'required|string|string|max:255|unique:channels,name,'.$request->channel_id,
            'shift_start' => ['date_format:H:i', 'required'],
            'shift_end' => ['date_format:H:i', 'required'],
            'project_id' => ['required', 'exists:App\Models\Project,id'],
            'position_id' => ['required', 'numeric'],
            'team_id' => ['required', 'exists:App\Models\Team,id'],
            'site' => ['required', Rule::in(['Manila', 'Leyte'])]
        ]);
        $user = User::findOrFail($request->id);

        $user->update([
            //"company_id"=> $request->company_id,
            "first_name" => $request->first_name,
            "last_name" => $request->last_name,
            "team_id" => $request->team_id,
            "site" => $request->site,
            "shift_start" => $request->shift_start,
            "shift_end" => $request->shift_end,
            "project_id" => $request->project_id,
            "position_id" => $request->position_id,
            "status_id" => 10,
        ]);
    }

    public function get_non_leaders()
    {
        return User::whereNotIn('user_level', [1, 2])->get();
    }

    public function get_leaders()
    {
        $positions = Positions::where('position', 'like', '%team%')
            ->orWhere('position', 'like', '%lead%')
            ->orWhere('position', 'like', '%train%')
            ->pluck('id');
        return User::whereIn('position_id', $positions)->get();
    }

    public function status_logs(Request $request)
    {
        $user = User::where('company_id', $request->company_id)->firstorFail();
        $breakdown = AgentLog::select(DB::raw('agent_session_id,date(created_at) as date'))
            ->where('user_id', $user->id)
            ->groupBy(DB::raw('agent_session_id,date(created_at)'))
            ->orderBy('date', 'desc')
            ->limit(3)
            ->get();

        return [
            'logs' => AgentLog::with(['status'])->whereIn('agent_session_id', $breakdown->pluck('agent_session_id'))->orderBy('created_at', 'asc')->get(),
            'name' => $user->first_name . ' ' . $user->last_name
        ];
    }


    public function status_logs_full(Request $request)
    {
        /*
        $request=
            "id" => "9",
            "dateRange" => array:2 [
                "from" => "2023-07-16T16:00:00.000Z"
                "to" => "2023-07-24T16:11:31.946Z"
            ]
        */
        $user = User::where('id', $request->id)->firstorFail();

        $from = Carbon::parse($request->dateRange['from'])->format('Y-m-d');
        $to = isset($request->dateRange['to']) ? Carbon::parse($request->dateRange['to'])->addDay()->format('Y-m-d') : null;
        $breakdown = AgentLog::select(DB::raw('agent_session_id,date(created_at) as date'))
            ->where('user_id', $user->id)
            ->where('created_at', '>=', $from)
            ->when($to, function ($q) use ($to) {
                $q->where('created_at', '<=', $to);
            })
            ->groupBy(DB::raw('agent_session_id,date(created_at)'))
            ->orderBy('date', 'desc')
            ->get();

        return AgentLog::with(['status'])->whereIn('agent_session_id', $breakdown->pluck('agent_session_id'))->orderBy('created_at', 'asc')->get();
    }

    public function transfer(Request $request)
    {
        $user = User::where('company_id', $request->company_id)->firstorFail();
        $user->update([
            'team_id' => $request->team_id
        ]);
    }


    public function resigned(Request $request)
    {
        $agent_log = User::findOrFail($request->id);
        #New Update Hard Delete if tag Resigned
        $agent_log->delete();
        // $agent_log->update([
        //     'is_resigned' => 1
        // ]);
    }
}