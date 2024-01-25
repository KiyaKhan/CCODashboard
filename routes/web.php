<?php

use App\Http\Controllers\Admin\AgentController;
use App\Http\Controllers\Admin\AgentLogController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\StatusController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TrackerController;
use App\Models\AgentLog;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
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




Route::middleware(['auth','is_admin'])->get('/', function () {

    return Inertia::render('Index',[
        'teams'=>Auth::user()->user_level==1?Team::all():Team::where('user_id',Auth::id())->get(),
        //'teams'=>Team::where('id',0)->get(),
        'available_team_leaders'=>User::where('user_level',2)->doesnthave('team')->get()
    ]);




})->name('index');


//Route::post('/settings/update_password',[SettingsController::class,'update_password'])->name('settings.update_password');






// Route::middleware(['auth'])->get('/',function(){
//     abort(403);
// })->name('public_path');

Route::middleware(['auth','is_admin'])->group(function(){
    Route::get('/get_dashboard_data',[AgentController::class,'get_data'])->name('get_data');
    Route::get('/get_card_data',[AgentController::class,'get_card_data'])->name('get_card_data');
    Route::get('/get_bar_chart_data',[AgentController::class,'get_bar_chart_data'])->name('get_bar_chart_data');
    Route::get('/notifications',[AgentController::class,'notifications'])->name('notifications');
    Route::prefix('agents')->name('agents.')->group(function(){
        Route::get('/agents',[AgentController::class,'index'])->name('index');
        Route::get('/get_non_leaders',[AgentController::class,'get_non_leaders'])->name('get_non_leaders');
        Route::get('/status_logs',[AgentController::class,'status_logs'])->name('status_logs');
        Route::get('/status_logs_full',[AgentController::class,'status_logs_full'])->name('status_logs_full');
        Route::post('/new',[AgentController::class,'new'])->name('new');
        Route::post('/update',[AgentController::class,'update'])->name('update');
        Route::post('/transfer',[AgentController::class,'transfer'])->name('transfer');
        
        Route::post('/resigned',[AgentController::class,'resigned'])->name('resigned');
    });



    Route::prefix('agent_log')->name('agent_log.')->group(function(){
        Route::get('/create',[AgentLogController::class,'create'])->name('create');
        Route::get('/edit',[AgentLogController::class,'edit'])->name('edit');
        Route::post('/update',[AgentLogController::class,'update'])->name('update');
        Route::post('/store',[AgentLogController::class,'store'])->name('store');
        Route::post('/destroy',[AgentLogController::class,'destroy'])->name('destroy');
    });

    

    Route::prefix('teams')->name('teams.')->group(function(){
        Route::post('/store',[TeamController::class,'store'])->name('store');
        Route::post('/update',[TeamController::class,'update'])->name('update');
        Route::get('/',[TeamController::class,'index'])->name('index');
        Route::get('/reports',[TeamController::class,'reports'])->name('reports');
        Route::get('/overbreaks',[TeamController::class,'overbreaks'])->name('overbreaks');
        Route::get('/lates',[TeamController::class,'lates'])->name('lates');
    });

    Route::prefix('projects')->name('projects.')->group(function(){
        
        Route::get('/',[ProjectController::class,'index'])->name('index');
        Route::post('/store',[ProjectController::class,'store'])->name('store');
        Route::post('/update',[ProjectController::class,'update'])->name('update');
    });
    

    Route::post('/admin/store',function(Request $request){
        $request->validate([
            'first_name' => ['string', 'max:255','required'],
            'last_name' => ['string', 'max:255','required'],
            'company_id' => ['string', 'max:255','unique:users','required'],
            'email' => ['max:255','unique:users','nullable'],
        ]);


        User::create([
            "company_id"=> $request->company_id,
            "first_name"=> $request->first_name,
            "last_name"=> $request->last_name,
            "site"=> 'Manila',
            "shift_start"=> "00:00",
            "shift_end"=> "23:00",
            "project_id"=> $request->project_id,
            "status_id"=> 10,
            "password"=> Hash::make('password'),
            "user_level"=>1
        ]);
    })->name('admin.store');

});

Route::middleware(['auth'])->group(function(){
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::prefix('profile')->name('profile.')->group(function(){
        
        Route::get('/index', function () {
            return Inertia::render('Profile',[
                'teams'=>Team::all(),
                
                'available_team_leaders'=>User::where('user_level',2)->doesnthave('team')->get(),
                'user'=>User::find(Auth::id())
            ]);
        })->name('index');
        Route::post('password', [PasswordController::class, 'update'])->name('password.update');
        Route::post('update', [ProfileController::class, 'update'])->name('update');
    });

    Route::prefix('tracker')->name('tracker.')->group(function(){
        
        
        Route::get('/session', [TrackerController::class, 'show'])->name('show');
        Route::post('/update', [TrackerController::class, 'update'])->name('update');
        Route::post('/logout', [TrackerController::class, 'logout'])->name('logout');

    });
});





Route::get('/tracker', [TrackerController::class, 'index'])->name('tracker.index');

Route::middleware('guest')->group(function () {
    
    Route::post('/tracker', [TrackerController::class, 'store'])->name('tracker.store');
    
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
                ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    
});


Route::get('/test',[TrackerController::class,'show_cookie'])->name('test');




