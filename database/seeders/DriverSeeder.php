<?php

namespace Database\Seeders;

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
        DB::table('drivers')->insert(['driver'=>'Pickup']);
        DB::table('drivers')->insert(['driver'=>'Tracking']);
        DB::table('drivers')->insert(['driver'=>'Rate quote']);
        DB::table('drivers')->insert(['driver'=>'Billing']);
        DB::table('drivers')->insert(['driver'=>'Others']);
    }
}
