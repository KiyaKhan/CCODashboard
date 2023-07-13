<?php

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/test',function(Request $request){
    
    $user=User::where('company_id',$request->company_id)->first();
    if(!$user){
        return response('Agent Not Found', 404);
    }
    Auth::login($user);
    return $user;
    //broadcast(new NewMessage($new_msg));
});

Route::post('/register',[ApiController::class,'register']);
