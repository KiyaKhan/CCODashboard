<?php

namespace App\Http\Controllers;

use App\Events\AgentChangeStatusEvent;
use App\Events\AgentLogInEvent;
use App\Events\AgentLogOutEvent;
use App\Http\Requests\Auth\TrackerLoginRequest;
use App\Models\AgentLog;
use App\Models\AgentSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TrackerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (Auth::check()) return redirect()->to(route('tracker.show'));
        return Inertia::render('Tracker');
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

    private int $session_id = 0;
    public function store(TrackerLoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();
        $user = User::where('company_id', $request->company_id)->first();
        $agent_session_id = $request->cookie('agent_session_id');
        $session =  AgentSession::where('id', $agent_session_id)->where('user_id', $user->id)->first();
        DB::transaction(function () use ($user, $session) {
            $session = ($user->status_id != 10 && $session) ? $session : AgentSession::create([
                'user_id' => $user->id,
                'status_id' => 13,
            ]);
            $this->session_id = $session->id;
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
        });
        broadcast(new AgentLogInEvent($user));
        //return redirect()->to(route('tracker.show'))->cookie('agent_session_id','10000',720)->toResponse();
        return response()->redirectTo(route('tracker.show'))->cookie('agent_session_id', $this->session_id, 720);
    }


    public function show(Request $request)
    {

        $agent_session_id = $request->cookie('agent_session_id') ?? 0;
        $session = AgentSession::where('id', $agent_session_id)->where('user_id', Auth::id())->first();
        if (!$session) return $this->logout($request);
        $log = AgentLog::with(['status'])
            ->select(['id', 'status_id', 'agent_session_id as session_id', 'created_at as start_time'])
            ->where('user_id', $request->user()->id)
            ->where('agent_session_id', $session->id)
            ->orderBy('created_at', 'desc')->get();
        return Inertia::render('TrackerSession', ['log' => $log]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {}


    public function update(Request $request)
    {
        $user = $request->user();
        $status_id = $request->status_id;
        $overtime_reason = $request->overtime_reason;
        $early_departure_reason = $request->early_departure_reason;
        $special_project_remark = $request->special_project_remark;
        $agent_session_id = $request->cookie('agent_session_id') ?? 0;
        $session = AgentSession::where('id', $agent_session_id)->where('user_id', $user->id)->first();
        if (!$session) return $this->logout($request);
        $session_id = $session->id;
        if (strval($status_id) == '10') {
            throw ValidationException::withMessages([
                'status_id' => 'You can not change your status to Offline',
            ]);
        }
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



        broadcast(new AgentChangeStatusEvent($user, $status_id));
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

    public function logout(Request $request)
    {

        $user = $request->user();
        $session_id = $request->cookie('agent_session_id');
        if (!$session_id) return redirect()->to(route('tracker.index'));


        AgentSession::where([
            'user_id' => $request->user()->id,
            'id' => $session_id
        ])->firstOrFail();


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
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();
        Cookie::queue(Cookie::forget('agent_session_id'));

        return redirect()->to(route('tracker.index'));
    }

    public function show_cookie(Request $request)
    {
        dd($request->cookie('agent_session_id'));
    }
}
