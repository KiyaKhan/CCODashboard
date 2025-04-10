<?php

namespace App\Jobs;

use App\Models\IntranetUser;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncIntranetData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */

    public function handle()
    {
        $ids = User::pluck('company_id');
        IntranetUser::whereIn('company_id', $ids)
            ->chunk(100, function ($intranet_personnels) {
                foreach ($intranet_personnels as $ip) {
                    if ($ip->shift) {
                        $personnel = User::firstOrNew([
                            'company_id' => $ip->company_id,
                        ]);
                        $personnel->first_name = $ip->first_name;
                        $personnel->last_name = $ip->last_name;
                        $personnel->shift_start = $ip->shift->start_time;
                        $personnel->shift_end = $ip->shift->end_time;
                        if ($personnel->isDirty() && $ip->shift->is_swing < 1) {
                            $personnel->save();
                        }
                    }
                }
            });
    }
}
