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
        
        /*
        $faker = Factory::create('en_US');

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

        for ($i=1; $i < 64; $i++) {
            
            User::create([
                'email' => $faker->safeEmail(),
                'company_id'=>'EMP'.strval($i),
                //password = admin
                'password'=>Hash::make('123'),
                'first_name'=>$faker->firstName(),
                'last_name'=>$faker->lastName(),
                'user_level'=>3
            ]);
        }

        for ($i=1; $i < 6; $i++) {
            
            User::create([
                'email' => $faker->safeEmail(),
                'company_id'=>'EMP'.strval($i),
                //password = admin
                'password'=>Hash::make('123'),
                'first_name'=>$faker->firstName(),
                'last_name'=>$faker->lastName(),
                'user_level'=>2
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
        */
        $statuses=[
            [
                'name'=>'Available/Email'
            ],
            [
                'name'=>'Available/Call'
            ],
            [
                'name'=>'Break'
            ],
            [
                'name'=>'Lunch'
            ],
            [
                'name'=>'Training'
            ],
            [
                'name'=>'Coaching'
            ],
            [
                'name'=>'PC Issue'
            ],
            [
                'name'=>'Floor Support'
            ],
            [
                'name'=>'Off The Phone/Others'
            ],
            [
                'name'=>'Offline'
            ]
        ];
        foreach($statuses as $status){
            Status::create(['name'=>$status['name']]);
        }
    }
}
