<?php

namespace App\Listeners;

use App\Events\AgentChangeStatusEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class AgentChangeStatusListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\AgentChangeStatusEvent  $event
     * @return void
     */
    public function handle(AgentChangeStatusEvent $event)
    {
        //
    }
}
