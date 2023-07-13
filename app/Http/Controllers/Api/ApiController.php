<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\APi\ApiPostRegisterRequest;
use App\Models\Status;
use App\Models\User;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function register(ApiPostRegisterRequest $request){
        return $request;
    }

    public function statuses(){
        return Status::all();
    }

    public function login(Request $request){
        $user=User::where('company_id',$request->company_id)->first();
        if(!$user){
            return response('Agent Not Found', 404);
        }
        $accessToken = $user->createToken($user->company_id);
        return [
            'accessToken'=>$accessToken->plainTextToken,
            'firstName'=>$user->first_name,
            'lastName'=>$user->last_name,
        ];
        //broadcast(new NewMessage($new_msg));
    }


    public function logout(Request $request){
        $request->user()->tokens()->delete();
        return 'Succesfully Logged Out!';
    }
}
