import { DataTable } from '@/Components/DataTable/DataTable';
import NavBar from '@/Components/NavBar'
import { TeamTableColumn, teamColumns } from '@/Components/TeamsComponents/TeamColumns';
import { Separator } from '@/Components/ui/separator';
import { ITeam, User } from '@/types'
import { Head } from '@inertiajs/react'
import React, { FC, useEffect, useMemo } from 'react'

interface TeamsProps{
    available_team_leaders:User[];
    teams:ITeam[];
}

const Teams:FC<TeamsProps> = ({available_team_leaders,teams}) => {
    
    const teamsData:TeamTableColumn[] = useMemo(()=>teams.map(({name,id,user,users})=>({id,name,team_leader:user!,size:users.length,members:users})),[teams])
    return (
        <>
            <Head title='Teams' />
            <div className="flex flex-col h-screen">
                <NavBar availableTeamLeaders={available_team_leaders} teams={teams} />
                <div className="flex-1 space-y-4 p-8 pt-6 h-full">
                    <div className="flex flex-col  space-y-3.5">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Teams</h2>
                            <p className='text-muted-foreground'>Manage Teams</p>
                        </div>
                        <Separator />
                        <DataTable columns={teamColumns} data={teamsData} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Teams