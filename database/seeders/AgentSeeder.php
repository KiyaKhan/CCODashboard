<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Status;
use App\Models\Team;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AgentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Factory::create('en_US');

        //ADMIN
        User::create([
            'id' => 1,
            'email' => 'admin@admin.com',
            'company_id' => 'admin',
            //password = admin
            'password' => Hash::make('admin'),
            'first_name' => 'Admin',
            'last_name' => 'Admin',
            'user_level' => 1
        ]);

        //TEAM LEADERS
        User::create([
            'id' => 2,
            'company_id' => 'tl1',
            'password' => Hash::make('admin'),
            'first_name' => 'Carlos Jr.',
            'last_name' => 'Bo',
            'user_level' => 2,
        ]);

        User::create([
            'id' => 3,
            'company_id' => 'tl2',
            'password' => Hash::make('admin'),
            'first_name' => 'Angielyn',
            'last_name' => 'Cabillo',
            'user_level' => 2,
        ]);

        User::create([
            'id' => 4,
            'company_id' => 'tl3',
            'password' => Hash::make('admin'),
            'first_name' => 'Lovely',
            'last_name' => 'Caca',
            'user_level' => 2,
        ]);

        User::create([
            'id' => 5,
            'company_id' => 'tl4',
            'password' => Hash::make('admin'),
            'first_name' => 'Jean',
            'last_name' => 'Lauzon',
            'user_level' => 2,
        ]);

        User::create([
            'id' => 6,
            'company_id' => 'tl5',
            'password' => Hash::make('admin'),
            'first_name' => 'Michael',
            'last_name' => 'Paranas',
            'user_level' => 2,
        ]);

        User::create([
            'id' => 7,
            'company_id' => 'tl6',
            'password' => Hash::make('admin'),
            'first_name' => 'Louie Ann',
            'last_name' => 'Zambrano',
            'user_level' => 2,
        ]);



        //AGENTS
        for ($i = 8; $i < 25; $i++) {

            User::create([
                'project_id' => Project::all()->random()->id,
                'email' => $faker->safeEmail(),
                'company_id' => 'EMP' . strval($i),
                'password' => Hash::make('123'),
                'first_name' => $faker->firstName(),
                'last_name' => $faker->lastName(),
                'user_level' => 3,
                'status_id' => 10
            ]);
        }

        $leaders = User::where('user_level', 2)->get();

        foreach ($leaders as $leader) {
            $team = Team::create([
                'user_id' => $leader->id,
                'name' => 'Team ' . $leader->first_name
            ]);
            $leader->update([
                'team_id' => $team->id
            ]);
        }

        $users = User::where('user_level', 3)->whereNull('team_id')->get();

        foreach ($users as $user) {
            $user->update([
                'team_id' => Team::all()->random()->id
            ]);
        }
    }
}
