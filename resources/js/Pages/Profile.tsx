import NavBar from '@/Components/NavBar';
import useCurrentUser from '@/Hooks/useCurrentUser';
import { ITeam, PageProps, User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import React, { FC, useEffect } from 'react'

interface ProfileProps{
    teams:ITeam[];
    available_team_leaders:User[];
}

const Profile:FC<ProfileProps> = ({available_team_leaders,teams}) => {
    
    return (
        <>
            <Head title='Profile' />
            <div className="flex flex-col">
                <NavBar availableTeamLeaders={available_team_leaders} teams={teams} />
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile