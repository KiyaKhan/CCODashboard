<?php

namespace App\Events;

use App\Models\CallEmailLog;
use App\Models\Status;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CallEmailLogEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $user;
    public $log;
    public $notification;
    /**
     * Create a new event instance.
     *
     * @return void
     */

    public function __construct(CallEmailLog $log, User $user)
    {
        //
        $this->user = $user;
        @$this->log = $log;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        error_log('🔥 Broadcasting AgentLogEvent!');
        return new PresenceChannel('global_channel');
    }
}