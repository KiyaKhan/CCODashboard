<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\AgentStatus;
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
        for ($i=100; $i < 107; $i++) {
            
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
        for ($i=2; $i < 52; $i++) {
            
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
            Team::create([
                'user_id'=>$leader->id,
                'name'=>'Team '.$leader->first_name
            ]);
        }
        
        $users = User::where('user_level',3)->whereNull('team_id')->get();

        foreach($users as $user){
            $user->update([
                'team_id'=>Team::all()->random()->id
            ]);
        }
        
        $statuses=[
            
            [
                'id'=>1,
                'name'=>'Available/Call'
            ],
            [
                'id'=>2,
                'name'=>'Available/Email'
            ],
            [
                'id'=>3,
                'name'=>'Break'
            ],
            [
                'id'=>4,
                'name'=>'Lunch'
            ],
            [
                'id'=>5,
                'name'=>'Training'
            ],
            [
                'id'=>6,
                'name'=>'Coaching'
            ],
            [
                'id'=>7,
                'name'=>'PC Issue'
            ],
            [
                'id'=>8,
                'name'=>'Floor Support'
            ],
            [
                'id'=>9,
                'name'=>'Off The Phone/Others'
            ],
            [
                'id'=>10,
                'name'=>'Offline'
            ]
        ];
        foreach($statuses as $status){
            Status::create(['name'=>$status['name']]);
        }
    }
}
