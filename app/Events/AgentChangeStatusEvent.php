<?php

namespace App\Events;

use App\Models\Notification;
use App\Models\Status;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AgentChangeStatusEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $user;
    public $notification;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(User $user,int $status_id)
    {
        $this->user=$user;
        $status = Status::find($status_id);
        @$this->notification= Notification::create([
            'user_id'=>$user->id,
            'team_id'=>$user->group->id ?? $user->team_id,
            'status_id'=>$status_id,
            'message'=>$user->first_name." ".$user->last_name." is now on '".$status->name."'."
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return  new PresenceChannel('global_channel');
        
    }
}
