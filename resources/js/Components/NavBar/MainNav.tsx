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
                navLinks.map(link=>(
                    //TODO:CHange to Inertia Links
                    <button
                        onClick={link.onClick}
                        key={link.label}
                        className={twMerge("text-sm font-medium transition-colors hover:text-primary",
                        route().current(link.link)?'text-base':'text-muted-foreground'
                        )}>
                        {link.label}
                    </button>
                ))
            }
            

        </nav>
    )
}

export default MainNav


    