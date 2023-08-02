<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\AgentStatus;
use App\Models\Project;
use App\Models\Status;
use App\Models\Team;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $statuses=[
            
            [
                'id'=>1,
                'name'=>'Calls'
            ],
            [
                'id'=>2,
                'name'=>'Emails'
            ],
            [
                'id'=>3,
                'name'=>'Break'
            ],
            [
                'id'=>4,
                'name'=>'Bio Break'
            ],
            [
                'id'=>5,
                'name'=>'Lunch'
            ],
            [
                'id'=>6,
                'name'=>'Training'
            ],
            [
                'id'=>7,
                'name'=>'Coaching'
            ],
            [
                'id'=>8,
                'name'=>'Meeting'
            ],
            [
                'id'=>9,
                'name'=>'System Issue'
            ],
            [
                'id'=>11,
                'name'=>'Floor Support'
            ],
            [
                'id'=>12,
                'name'=>'Special Assignment'
            ],
            [
                'id'=>13,
                'name'=>'Not Ready'
            ],
            [
                'id'=>10,
                'name'=>'Offline'
            ]
        ];
        foreach($statuses as $status){
            Status::create(['id'=>$status['id'],'name'=>$status['name']]);
        }
        
        
        
        Project::create(['id'=>1,'name'=>'Twin Lakes']);
        Project::create(['id'=>2,'name'=>'Vienna']);
        
        $faker = Factory::create('en_US');

         //ADMIN
        User::create([
            'id' =>1,  
            'email' => 'admin@admin.com',
            'company_id'=>'admin',
            //password = admin
            'password'=>Hash::make('admin'),
            'first_name'=>'Admin',
            'last_name'=>'Admin',
            'user_level'=>1
        ]);

        //TEAM LEADERS
        for ($i=100; $i < 102; $i++) {
            
            User::create([
                'email' => $faker->safeEmail(),
                'company_id'=>'EMP'.strval($i),
                'password'=>Hash::make('123'),
                'first_name'=>$faker->firstName(),
                'last_name'=>$faker->lastName(),
                'user_level'=>2,
                'status_id'=>10
            ]);
        }

        //AGENTS
        for ($i=1; $i < 10; $i++) {
            
            User::create([
                'email' => $faker->safeEmail(),
                'company_id'=>'EMP'.strval($i),
                'password'=>Hash::make('123'),
                'first_name'=>$faker->firstName(),
                'last_name'=>$faker->lastName(),
                'user_level'=>3,
                'status_id'=>10
            ]);
        }


        $leaders = User::where('user_level',2)->get();

        foreach($leaders as $leader){
            $team=Team::create([
                'project_id'=>Project::all()->random()->id,
                'user_id'=>$leader->id,
                'name'=>'Team '.$leader->first_name
            ]);
            $leader->update([
                'team_id'=>$team->id
            ]);

        }
        
        $users = User::where('user_level',3)->whereNull('team_id')->get();

        foreach($users as $user){
            $user->update([
                'team_id'=>Team::all()->random()->id
            ]);
        }
        
        
    }
}
