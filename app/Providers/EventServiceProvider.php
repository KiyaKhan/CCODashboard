<?php

namespace App\Providers;

use App\Events\AgentChangeStatusEvent;
use App\Events\AgentLogInEvent;
use App\Listeners\AgentChangeStatusListener;
use App\Listeners\AgentLogInEventListener;
use App\Listeners\AgentLogOutListener;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        AgentLogInEvent::class=>[
            AgentLogInEventListener::class
        ],
        AgentChangeStatusEvent::class=>[
            AgentChangeStatusListener::class
        ],
        AgentLogOutEvent::class=>[
            AgentLogOutListener::class
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents()
    {
        return false;
    }
}
