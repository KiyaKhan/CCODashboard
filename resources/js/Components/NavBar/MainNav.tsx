import navLinks from '@/Libs/NavRoutes'
import { cn } from '@/Libs/Utils'
import { Link } from '@inertiajs/react'
import React, { FC, HTMLAttributes, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'



const MainNav:FC<HTMLAttributes<HTMLElement>> = ({className,...props}) => {
    
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
            >
            {
                navLinks.map(({Icon,...link})=>(
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


    