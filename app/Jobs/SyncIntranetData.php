<?php

namespace App\Jobs;

use App\Models\IntranetTeam;
use App\Models\IntranetUser;
use App\Models\Team;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use function PHPSTORM_META\map;

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
        # SYNC TEAMS
        $rms_map_team = Team::with('user')->get()
            ->mapWithKeys(function ($team) {
                $company_id = strtoupper($team->user->company_id);
                return ["{$company_id}" => $team->id];
            });
        $cross_team_ref = IntranetTeam::with('user')
            ->whereHas('user', function ($query) use ($ids) {
                $query->whereIn('company_id', $ids);
            })
            ->get()
            ->mapWithKeys(function ($team) use (&$rms_map_team) {

                if ($team->user) {
                    $company_id = strtoupper($team->user->company_id);
                    if (isset($rms_map_team[$company_id])) {
                        return ["{$team->user->company_id}" => $rms_map_team[$company_id]];
                    }
                }
                return [];
            });
        # SYNC USERS
        IntranetUser::whereIn('company_id', $ids)
            ->chunk(100, function ($intranet_personnels) use ($cross_team_ref) {
                foreach ($intranet_personnels as $ip) {
                    if ($ip->shift) {
                        $personnel = User::with(['team'])->firstOrNew([
                            'company_id' => $ip->company_id,
                        ]);
                        $personnel->first_name = $ip->first_name;
                        $personnel->last_name = $ip->last_name;
                        $personnel->shift_start = $ip->shift->start_time;
                        $personnel->shift_end = $ip->shift->end_time;
                        if (isset($ip->team) && isset($ip->team->user)) {
                            $intranet_tl_company_id = strtoupper($ip->team->user->company_id);
                            error_log('company_id: ' . $intranet_tl_company_id);
                            if (!empty($intranet_tl_company_id) && isset($cross_team_ref[$intranet_tl_company_id])) {
                                $personnel->team_id = $cross_team_ref[$intranet_tl_company_id];
                            }
                        }
                        if ($personnel->isDirty() && $ip->shift->is_swing < 1) {
                            $personnel->save();
                        }
                    }
                }
            });
    }
}
