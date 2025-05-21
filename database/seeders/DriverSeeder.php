<?php

namespace Database\Seeders;

use App\Models\Driver;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DriverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */

    public function run()
    {
        $defaults = [
            ['driver' => 'Pickup', 'project_id' => NULL],
            ['driver' => 'Tracking', 'project_id' => NULL],
            ['driver' => 'Rate quote', 'project_id' => NULL],
            ['driver' => 'Billing', 'project_id' => NULL],
            ['driver' => 'Others', 'project_id' => NULL],
        ];
        $WWEX = [
            ['driver' => 'OMB - Additional Info', 'project_id' => 5],
            ['driver' => 'Carrier Payment Received', 'project_id' => 5],
            ['driver' => 'OBM - Approved', 'project_id' => 5],
            ['driver' => 'OBM - Declined', 'project_id' => 5],
            ['driver' => 'Claim Filed', 'project_id' => 5],
            ['driver' => 'OBM - Under $50', 'project_id' => 5],
            ['driver' => 'OMB - Claim Under Review', 'project_id' => 5],
            ['driver' => 'Clear POD Concealed - After 5 Days - Carrier Direct', 'project_id' => 5],
            ['driver' => 'Shortage Cleared', 'project_id' => 5],
            ['driver' => 'Submit For Payment', 'project_id' => 5],
            ['driver' => 'Others', 'project_id' => 5],
            ['driver' => 'Rebutted', 'project_id' => 5],
            ['driver' => 'Carrier Letters', 'project_id' => 5],
        ];

        foreach ($WWEX as $data) {
            Driver::updateOrCreate(
                [
                    'driver' => $data['driver'],
                    'project_id' => $data['project_id']
                ],
                [
                    'driver' => $data['driver'],
                    'project_id' => $data['project_id']
                ]
            );
        }
    }
}
