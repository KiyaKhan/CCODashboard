<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

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
}
