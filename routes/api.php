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

Route::get('/teams_and_projects', [ApiController::class, 'teams_and_projects'])->name('api.teams_and_projects');

Route::get('/positions', [ApiController::class, 'positions'])->name('api.positions');
Route::get('/projects', [ApiController::class, 'projects'])->name('api.projects');;
Route::get('/teams', [ApiController::class, 'teams'])->name('api.teams');;
Route::get('/statuses/{project_id?}', [ApiController::class, 'statuses']);
Route::get('/statuses_all/{project_id?}', [ApiController::class, 'statuses_all'])->name('api.statuses_all');
Route::post('/register', [ApiController::class, 'register'])->name('register');
Route::post('/reset', [ApiController::class, 'forgotPassword'])->name('reset');
Route::post('/login', [ApiController::class, 'login']);
Route::get('/drivers/{project_id?}', [ApiController::class, 'drivers'])->name('drivers');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [ApiController::class, 'logout']);
    Route::post('/change_status', [ApiController::class, 'change_status']);

    Route::post('/start_log', [ApiController::class, 'start_log']);

    Route::post('/end_log', [ApiController::class, 'end_log']);
});
