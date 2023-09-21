import navLinks from '@/Libs/NavRoutes'
import { cn } from '@/Libs/Utils'
import { PageProps } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import React, { useMemo,FC, HTMLAttributes, useEffect } from 'react'
import { twMerge } from 'tailwind-merge';



const MainNav:FC<HTMLAttributes<HTMLElement>> = ({className,...props}) => {
    
    const {user} = usePage<PageProps>().props.auth;
    const LINKS = useMemo(()=>user.user_level.toString()==='1'?navLinks:navLinks.filter(link=>!link.forAdmin),[user,navLinks]);
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
            >
            {
                LINKS.map(({Icon,...link})=>(
                    //TODO:CHange to Inertia Links if possible...
                    <button
                        onClick={link.onClick}
                        key={link.label}
                        className={twMerge("text-lg font-semibold transition-colors hover:text-primary flex items-center space-x-0 md:space-x-2",
                        !route().current(link.link)&&'text-muted-foreground'
                        )}>
                        <Icon className='w-7 h-7 sm:w-5 sm:h-5' />
                        <span className='sm:inline hidden'>{link.label}</span>
                    </button>
                ))
            }
            

        </nav>
    )
}

export default MainNav


    