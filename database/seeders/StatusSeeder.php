<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $statuses = [

            [
                'id' => 1,
                'name' => 'Calls'
            ],
            [
                'id' => 2,
                'name' => 'Emails'
            ],
            [
                'id' => 3,
                'name' => 'Break'
            ],
            [
                'id' => 4,
                'name' => 'Bio Break'
            ],
            [
                'id' => 5,
                'name' => 'Lunch'
            ],
            [
                'id' => 6,
                'name' => 'Training'
            ],
            [
                'id' => 7,
                'name' => 'Coaching'
            ],
            [
                'id' => 8,
                'name' => 'Meeting'
            ],
            [
                'id' => 9,
                'name' => 'System Issue'
            ],
            [
                'id' => 11,
                'name' => 'Floor Support'
            ],
            [
                'id' => 12,
                'name' => 'Special Assignment'
            ],
            [
                'id' => 13,
                'name' => 'Not Ready'
            ],
            [
                'id' => 10,
                'name' => 'Offline'
            ]
        ];
        $WWEX = [
            ['id' => 0, 'name' => 'OMB - Additional Info', 'project_id' => 5],
            ['id' => 0, 'name' => 'Carrier Payment Received', 'project_id' => 5],
            ['id' => 0, 'name' => 'OBM - Approved', 'project_id' => 5],
            ['id' => 0, 'name' => 'OBM - Declined', 'project_id' => 5],
            ['id' => 0, 'name' => 'Claim Filed', 'project_id' => 5],
            ['id' => 0, 'name' => 'OBM - Under $50', 'project_id' => 5],
            ['id' => 0, 'name' => 'OMB - Claim Under Review', 'project_id' => 5],
            ['id' => 0, 'name' => 'Clear POD Concealed - After 5 Days - Carrier Direct', 'project_id' => 5],
            ['id' => 0, 'name' => 'Shortage Cleared', 'project_id' => 5],
            ['id' => 0, 'name' => 'Submit For Payment', 'project_id' => 5],
            ['id' => 0, 'name' => 'Others', 'project_id' => 5],
            ['id' => 0, 'name' => 'Rebutted', 'project_id' => 5],
            ['id' => 0, 'name' => 'Bio Break', 'project_id' => 5],
            ['id' => 0, 'name' => 'Break', 'project_id' => 5],
            ['id' => 0, 'name' => 'Lunch Break', 'project_id' => 5],
            ['id' => 0, 'name' => 'Coaching/Meeting', 'project_id' => 5],
            ['id' => 0, 'name' => 'System Issue', 'project_id' => 5],
            ['id' => 0, 'name' => 'LOG IN', 'project_id' => 5],
            ['id' => 0, 'name' => 'LOGOUT', 'project_id' => 5],
            ['id' => 0, 'name' => 'Carrier Letters', 'project_id' => 5],
        ];

        foreach ($WWEX as $status) {
            Status::create(['id' => $status['id'], 'name' => $status['name'], 'project_id' => $status['project_id']]);
        }
    }
}
