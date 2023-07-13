<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



Route::middleware(['auth'])->get('/', function () {
    return Inertia::render('Index',[
        'teams'=>Team::all(),
        'available_team_leaders'=>User::where('user_level',2)->doesnthave('team')->get()
    ]);
})->name('index');

Route::middleware(['auth'])->get('/profile', function () {
    

    return Inertia::render('Profile',[
        'teams'=>Team::all(),
        'available_team_leaders'=>User::where('user_level',2)->doesnthave('team')->get()
    ]);
})->name('profile');





// Route::middleware(['auth'])->get('/',function(){
//     abort(403);
// })->name('public_path');


Route::middleware(['auth'])->group(function(){
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});







Route::middleware('guest')->group(function () {
    

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
                ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    
});





