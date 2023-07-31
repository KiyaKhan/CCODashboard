import React, { FC } from 'react'
import TeamSwitcher from './NavBar/TeamSwitcher'
import { ITeam, User } from '../types/index';
import MainNav from './NavBar/MainNav';
import UserNav from './NavBar/UserNav';
import { FaLightbulb } from 'react-icons/fa';
import { Button } from './ui/button';
import useToggleDark from '@/Hooks/useToggleDark';
import { BsMoonStars } from 'react-icons/bs';

interface NavBarProps {
    teams:ITeam[];
    availableTeamLeaders:User[];
}

const NavBar:FC<NavBarProps> = ({teams,availableTeamLeaders}) => {
    const {toggleTheme,isDark} = useToggleDark();
    return (
        <div className='border-b'>
            <div className="flex h-16 items-center px-4">
                <TeamSwitcher teams={teams} availableTeamLeaders={availableTeamLeaders} />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <Button onClick={toggleTheme} size='icon' className='hidden sm:flex bg-white border-black dark:bg-black dark:border-white'>
                        {
                            !isDark?<BsMoonStars size={20} className='dark:text-white text-black' />:<FaLightbulb size={20} className='dark:text-white text-black' />
                        }
                        
                        
                    </Button>
                    <UserNav />
                </div>
            </div>
        </div>
    )
}

export default NavBar