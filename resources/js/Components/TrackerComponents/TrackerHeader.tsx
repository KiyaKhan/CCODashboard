import useToggleDark from '@/Hooks/useToggleDark';
import React, { FC, ReactNode } from 'react'
import { Button } from '../ui/button';
import { BsMoonStars } from 'react-icons/bs';
import { FaLightbulb } from 'react-icons/fa';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';


const TrackerHeader= () => {
    const {toggleTheme,isDark} = useToggleDark();
    return (
        <div className='w-full shadow-muted-foreground shadow-sm h-14 absolute top-0 flex items-center justify-between px-3.5 bg-secondary'>
            <div className='font-bold tracking-tight text-2xl'>
                RMS Tracker (BETA)
            </div>
            <div className='flex items-center gap-x-2'>
                <Button onClick={toggleTheme} size='icon' className='hidden sm:flex bg-white border-black dark:bg-black dark:border-white'>
                    {
                        !isDark?<BsMoonStars size={20} className='dark:text-white text-black' />:<FaLightbulb size={20} className='dark:text-white text-black' />
                    }
                    
                    
                </Button>
                
            </div>
        </div>
    )
}

export default TrackerHeader