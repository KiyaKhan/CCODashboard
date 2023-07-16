<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AgentController extends Controller
{
    public function index(Request $request){
        $filter=$request->filter;
        $status_id=$request->status_id;
        return User::with(['group','status'])
        ->where('team_id',$request->team_id)
        ->where(function ($q) use($filter) {
            $q->orWhere('company_id','like','%'.$filter.'%')
            ->orWhere('first_name','like','%'.$filter.'%')
            ->orWhere('last_name','like','%'.$filter.'%');
        })
        ->where('status_id','like','%'.$status_id.'%')
        ->get();
    }

    public function get_data(Request $request){
        $team_id=$request->team_id;
        $recent_notifications = Notification::where('team_id',$team_id)->limit(10)->orderBy('created_at','desc')->get();
        $user=User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id);
        return [
            'recent_notifications'=>$recent_notifications,
            'dashboard_cards'=>[
                'team_size'=>$user->count(),
                'total_online'=>$user->whereNot('status_id',10)->count(),
                'total_on_lunch_or_break'=>$user->whereIn('status_id',[3,4,5])->count(),
                'total_on_call'=>$user->where('status_id',1)->count(),
                'total_on_email'=>$user->where('status_id',2)->count(),
            ]
        ];
    }
}
