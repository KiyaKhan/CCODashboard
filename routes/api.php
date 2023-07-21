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



Route::get('/teams',[ApiController::class,'teams'])->name('api.teams');;
Route::get('/statuses',[ApiController::class,'statuses']);
Route::post('/register',[ApiController::class,'register'])->name('register');
Route::post('/login',[ApiController::class,'login']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/logout',[ApiController::class,'logout']);
    Route::post('/change_status',[ApiController::class,'change_status']);
});


