<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\DriverTag;
use App\Models\Project;
use App\Models\ProjectSettings;
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
        $projects = Project::with(['users', 'tags', 'drivers', 'settings'])->get();
        return Inertia::render('Project', [
            'projects' => $projects,
            'teams' => Team::with(['user', 'users'])->get(),
            'available_team_leaders' => User::where('user_level', 2)->doesnthave('team')->get()
        ]);
    }
    public function store(Request $request)
    {
        Project::create(['name' => $request->name]);
    }
    public function update(Request $request)
    {
        $project = Project::findOrFail($request->id);
        $project->update([
            'name' => $request->name
        ]);
    }
    public function destroy(Request $request)
    {
        $project = Project::findOrFail($request->id);
        $project->delete();
    }
    public function project_monitoring($team_id = null)
    {
        $project_ids = User::where('team_id', $team_id)->pluck('project_id');
        $projects = Project::when($team_id || $team_id > 0, function ($query) use ($project_ids) {
            $query->whereIn('id', $project_ids);
        })
            ->with('settings', 'tags')
            ->get();
        return response()->json($projects);
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
        $tag_id = isset($request->tag_id) ? ($request->tag_id > 0 ? $request->tag_id : null) : null;
        Driver::updateOrCreate(
            ['id' => $request->id],
            [
                'driver' => $request->driver,
                'project_id' => $request->project_id,
                'tag_id' => $tag_id
            ]
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
    /*TAG DRIVER*/
    public function save_tag_driver(Request $request)
    {
        DriverTag::updateOrCreate(
            ['id' => $request->id],
            ['name' => $request->name, 'project_id' => $request->project_id]
        );
        return redirect()->back();
    }
    public function delete_tag_driver(Request $request)
    {
        $ids = $request->ids;
        $tags = DriverTag::whereIn('id', $ids);
        $tags->delete();
        return redirect()->back();
    }
    public function add_settings(Request $request)
    {
        ProjectSettings::updateOrCreate(
            [
                'project_id' => $request->project_id,
            ],
            [
                'is_monitored' => $request->is_monitored
            ]
        );
        return redirect()->back();
    }
}
