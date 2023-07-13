import React, { FC } from 'react'
import TeamSwitcher from './NavBar/TeamSwitcher'
import { ITeam, User } from '../types/index';
import MainNav from './NavBar/MainNav';
import UserNav from './NavBar/UserNav';

interface NavBarProps {
    teams:ITeam[];
    availableTeamLeaders:User[];
}

const NavBar:FC<NavBarProps> = ({teams,availableTeamLeaders}) => {
    return (
        <div className='border-b'>
            <div className="flex h-16 items-center px-4">
                <TeamSwitcher teams={teams} availableTeamLeaders={availableTeamLeaders} />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <UserNav />
                </div>
            </div>
        </div>
    )
}

export default NavBar