import CalendarDateRangePicker from '@/Components/CalendarDateRangePicker';
import NavBar from '@/Components/NavBar';
import TabContainer from '@/Components/TabContainer/TabContainer';
import { Button } from '@/Components/ui/button';
import { Tabs } from '@/Components/ui/tabs';
import useCurrentUser from '@/Hooks/useCurrentUser';
import { INotification, ITeam, PageProps, User } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import React, { FC, useEffect, useState } from 'react'
import { BiCircle } from 'react-icons/bi';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import axios from 'axios';
import { toast } from 'react-toastify';
import useDashboardInfo from '@/Hooks/useDashboardInfo';
import EchoCointainer from '@/Containers/EchoCointainer';
interface IndexProps{
    teams:ITeam[];
    available_team_leaders:User[];
}

type GetDataResponse = {
    data:{
        recent_notifications:INotification[],
        dashboard_cards:{
            team_size:number,
            total_on_call:number,
            total_on_email:number,
            total_on_lunch_or_break:number,
            total_online:number
        }
    };
}

const Index:FC<IndexProps> = ({teams,available_team_leaders}) => {
    const {selectTeam,selectedTeam} = useSelectedTeam();
    const {setCurrentUser} = useCurrentUser();
    const {user} = usePage<PageProps>().props.auth;
    const [loading,setLoading] = useState<boolean>(true);
    const {setRecentNotifications,setAgentBreakdown} = useDashboardInfo();
    useEffect(()=>{
        setCurrentUser(user);
        if(teams) selectTeam(teams[0]);
    },[]);

    useEffect(()=>{
        if(!selectedTeam)return;
        const team_id=selectedTeam.id
        setLoading(true);
        axios.get(route('get_data',{
            team_id
        }))
        .then(({data}:GetDataResponse)=>{ 
            setRecentNotifications(data.recent_notifications);
            setAgentBreakdown(data.dashboard_cards)
        })
        .catch(e=>toast.error('Something went wront. Please refresh the page and try again'))
        .finally(()=>setLoading(false));
    },[selectedTeam])

    return (
        <>
            <Head title='Dashboard' />
            <div className="flex flex-col h-screen">
                <NavBar availableTeamLeaders={available_team_leaders} teams={teams} />
                <div className="flex-1 space-y-4 p-8 pt-6 h-full">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <div className="flex items-center space-x-2">
                            <CalendarDateRangePicker />
                            <Button className='font-semibold'>Download Report</Button>
                        </div>
                    </div>
                    <Tabs defaultValue="overview" className="space-y-4 h-full w-full">
                        {loading?<div className='w-full flex items-center justify-center'><BiCircle size={96}  className='text-sky-500 animate-ping mt-48' /></div>:<TabContainer />}
                    </Tabs>
                </div>
            </div>
            <EchoCointainer />
        </>
    )
}

export default Index