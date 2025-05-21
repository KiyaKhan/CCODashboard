<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $projects = [
            ['id' => 1, 'name' => 'TForce'],
            ['id' => 2, 'name' => 'GLS CC'],
            ['id' => 3, 'name' => 'MVE AR'],
            ['id' => 4, 'name' => 'Sutton'],
            ['id' => 5, 'name' => 'WWEX'],
            ['id' => 6, 'name' => 'CCO'],
            ['id' => 7, 'name' => 'TST'],
            ['id' => 8, 'name' => 'GLS AR']
        ];

        foreach ($projects as $project) {
            Project::UpdateOrCreate(
                ['name' => $project['name']],
                [
                    'id' => $project['id'],
                    'name' => $project['name']
                ]
            );
        }
        // Project::create(['id' => 1, 'name' => 'Project Tacoma']);
        // Project::create(['id' => 2, 'name' => 'Project Grand']);
        // Project::create(['id' => 3, 'name' => 'Project Grand/Twin Lakes']);
        // Project::create(['id' => 4, 'name' => 'Twin Lakes']);
        // Project::create(['id' => 5, 'name' => 'Valley IS']);
        // Project::create(['id' => 6, 'name' => 'CCO']);
    }
}
