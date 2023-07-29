<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AgentLog;
use App\Models\AgentSession;
use App\Models\Status;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AgentLogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        return [
            'agent_session'=>AgentSession::with(['user'])->findOrFail($request->agent_session_id),
            'statuses'=>Status::all()
        ];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $session = AgentSession::findOrFail($request->agent_session_id);
        
        $agent_log = AgentLog::create([
            'user_id'=>$session->user_id,
            'status_id'=>$request->status_id,
            'agent_session_id'=>$request->agent_session_id,
            'overtime_reason'=>$request->overtime_reason,
            'early_departure_reason'=>$request->early_departure_reason,
            'special_project_remark'=>$request->special_project_remark,
            'created_at'=>Carbon::parse($request->timestamp),
            'updated_at'=>Carbon::parse($request->timestamp)
        ]);
        return AgentLog::with(['status'])->where('agent_session_id',$agent_log->agent_session_id)->orderBy('created_at','asc')->get();
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

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request)
    {
        return [
            'agent_log'=>AgentLog::with(['user','status'])->findOrFail($request->agent_log_id),
            'statuses'=>Status::all()
        ];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $agent_log=AgentLog::findOrFail($request->agent_log_id);
        $agent_log->update([
            'status_id'=>$request->status_id,
            'overtime_reason'=>$request->overtime_reason,
            'early_departure_reason'=>$request->early_departure_reason,
            'special_project_remark'=>$request->special_project_remark,
            'created_at'=>Carbon::parse($request->timestamp),
            'updated_at'=>Carbon::parse($request->timestamp)
        ]);
        return AgentLog::with(['status'])->where('agent_session_id',$agent_log->agent_session_id)->orderBy('created_at','asc')->get();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $agent_log=AgentLog::findOrFail($request->agent_log_id);
        $agent_log->delete();
    }
}
