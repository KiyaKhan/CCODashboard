<?php

namespace App\Console\Commands;

use App\Models\CallEmailLog;
use App\Models\Driver;
use Illuminate\Console\Command;

class SyncDriver extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:driver';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assigns ID based on driver value';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $driver_map = Driver::pluck('id', 'driver')->toArray();
        $call_email_logs = CallEmailLog::all();
        foreach ($call_email_logs as $data) {
            if (isset($driver_map[$data->driver])) {
                $this->info('UPDATED: ' . $data->driver);
                $data->driver_id = $driver_map[$data->driver];
                $data->save();
            } else {
                $this->error('NOT FOUND: ' . $data->driver);
            }
        }
    }
}
