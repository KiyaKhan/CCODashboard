<?php

namespace App\Listeners;

use App\Events\AgentLogInEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class AgentLogInEventListener
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
     * @param  \App\Events\AgentLogInEvent  $event
     * @return void
     */
    public function handle(AgentLogInEvent $event)
    {
        //
    }
}
