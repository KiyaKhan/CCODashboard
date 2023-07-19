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
        ->when($status_id,function($q) use($status_id){
            $q->where('status_id',$status_id);
        })
        ->get();
    }

    public function get_data(Request $request){
        $team_id=$request->team_id;
        $recent_notifications = Notification::with(['user'])->where('team_id',$team_id)->limit(5)->orderBy('created_at','desc')->get();
        $user=User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id);
        return [
            'recent_notifications'=>$recent_notifications,
            'dashboard_cards'=>[
                'team_size'=>$user->count(),
                'total_online'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->whereNot('status_id',10)->count(),
                'total_on_lunch_or_break'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->whereIn('status_id',[3,4,5])->count(),
                'total_on_call'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',[1])->count(),
                'total_on_email'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',[2])->count(),
            ],
            'bar_chart'=>[
                ['name'=>'calls','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',1)->count()],
                ['name'=>'emails','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',2)->count()],
                ['name'=>'break','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',3)->count()],
                ['name'=>'bio_break','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',4)->count()],
                ['name'=>'lunch','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',5)->count()],
                ['name'=>'training','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',6)->count()],
                ['name'=>'coaching','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',7)->count()],
                ['name'=>'meeting','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',8)->count()],
                ['name'=>'system_issue','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',9)->count()],
                ['name'=>'floor_support','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',11)->count()],
                ['name'=>'special_assignment','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',12)->count()],
            ]
        ];
    }


    public function get_card_data(Request $request){
        $team_id=$request->team_id;
        $user=User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id);
        return [
            'team_size'=>$user->count(),
            'total_online'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->whereNot('status_id',10)->count(),
            'total_on_lunch_or_break'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->whereIn('status_id',[3,4,5])->count(),
            'total_on_call'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',[1])->count(),
            'total_on_email'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',[2])->count(),
        ];
    }

    public function get_bar_chart_data(Request $request){
        $team_id=$request->team_id;
        return [
            ['name'=>'calls','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',1)->count()],
            ['name'=>'emails','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',2)->count()],
            ['name'=>'break','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',3)->count()],
            ['name'=>'bio_break','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',4)->count()],
            ['name'=>'lunch','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',5)->count()],
            ['name'=>'training','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',6)->count()],
            ['name'=>'coaching','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',7)->count()],
            ['name'=>'meeting','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',8)->count()],
            ['name'=>'system_issue','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',9)->count()],
            ['name'=>'floor_support','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',11)->count()],
            ['name'=>'special_assignment','total'=>User::whereNot('id',1)->whereNotNull('team_id')->where('team_id',$team_id)->where('status_id',12)->count()],
        ];
    }

    public function notifications(Request $request){
        
        $team_id=$request->team_id;
        return Notification::with(['user'])
            ->when($team_id,function($q) use($team_id){
                $q->where('team_id',$team_id);
            })
            ->orderBy('created_at','desc')
            ->get();
    }
}
