import CalendarDateRangePicker from '@/Components/CalendarDateRangePicker';
import NavBar from '@/Components/NavBar';
import TabContainer from '@/Components/TabContainer/TabContainer';
import { Button } from '@/Components/ui/button';
import { Tabs } from '@/Components/ui/tabs';
import useCurrentUser from '@/Hooks/useCurrentUser';
import { ITeam, PageProps, User } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import React, { FC, useEffect } from 'react'

interface IndexProps{
    teams:ITeam[];
    available_team_leaders:User[];
}

const Index:FC<IndexProps> = ({teams,available_team_leaders}) => {
    const {setCurrentUser} = useCurrentUser();
    const {user} = usePage<PageProps>().props.auth;
    useEffect(()=>setCurrentUser(user),[]);
    return (
        <>
            <Head title='CCO Dashboard' />
            <div className="flex flex-col">
                <NavBar availableTeamLeaders={available_team_leaders} teams={teams} />
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <div className="flex items-center space-x-2">
                            <CalendarDateRangePicker />
                            <Button className='font-semibold'>Download Report</Button>
                        </div>
                    </div>
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabContainer />
                    </Tabs>
                </div>
            </div>
        </>
    )
}

export default Index