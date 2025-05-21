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
        $this->call([
            // ProjectSeeder::class,
            // StatusSeeder::class,
            // AgentSeeder::class
            DriverSeeder::class
        ]);
    }
}
