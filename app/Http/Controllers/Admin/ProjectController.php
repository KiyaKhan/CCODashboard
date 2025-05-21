<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Project;
use App\Models\Status;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $projects = Project::with(['users', 'statuses', 'drivers'])->get();
        return Inertia::render('Project', [
            'projects' => $projects,
            'teams' => Team::with(['user', 'users'])->get(),
            'available_team_leaders' => User::where('user_level', 2)->doesnthave('team')->get()
        ]);
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
        Project::create(['name' => $request->name]);
    }
    public function save_status(Request $request)
    {
        Status::updateOrCreate(
            ['id' => $request->id],
            ['name' => $request->name, 'project_id' => $request->project_id]
        );
        return redirect()->back();
    }
    public function save_order_status(Request $request)
    {
        $statuses = collect($request->statuses);
        $statuses->each(function ($item) {
            $status = Status::find($item['id']);
            if ($status) {
                $status->position = $item['position'];
                $status->save();
            }
        });
        return redirect()->back();
    }
    public function save_driver(Request $request)
    {
        Driver::updateOrCreate(
            ['id' => $request->id],
            ['driver' => $request->driver, 'project_id' => $request->project_id]
        );
        return redirect()->back();
    }
    public function delete_status(Request $request)
    {
        $ids = $request->ids;
        $status = Status::whereIn('id', $ids);
        $status->delete();
        return redirect()->back();
    }
    public function delete_driver(Request $request)
    {
        $ids = $request->ids;
        $status = Driver::whereIn('id', $ids);
        $status->delete();
        return redirect()->back();
    }
    public function save_order_driver(Request $request)
    {
        $drivers = collect($request->drivers);
        $drivers->each(function ($item) {
            $driver = Driver::find($item['id']);
            if ($driver) {
                $driver->position = $item['position'];
                $driver->save();
            }
        });
        return redirect()->back();
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
    public function edit($id)
    {
        //
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
        $project = Project::findOrFail($request->id);
        $project->update([
            'name' => $request->name
        ]);
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
}