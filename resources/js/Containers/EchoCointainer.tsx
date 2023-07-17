import useCurrentUser from '@/Hooks/useCurrentUser';
import useDashboardInfo from '@/Hooks/useDashboardInfo';
import useEcho from '@/Hooks/useEcho';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import { INotification, PageProps, User } from '@/types';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { FC, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

type EchoEvent ={
    notification:INotification;
    user:User;
}

const EchoCointainer:FC = () => {
    
    const {setEcho} = useEcho();
    const {appendRecentNotifications,setAgentBreakdown} = useDashboardInfo();
    const {selectedTeam} = useSelectedTeam();
    const refreshCards = useCallback(async() =>{
        console.log(selectedTeam);
        if(!selectedTeam) return;
        console.log('refreshCards');
        axios.get(route('get_card_data',{
            team_id:selectedTeam.id
        }))
        .then(({data})=>{
            console.log(data);
            setAgentBreakdown(data);
        })
        .catch(e=>toast.error('Something went wrong. Please refresh the page'))
    },[selectedTeam,setAgentBreakdown]);
    


    useEffect(()=>{
        
        setEcho(null);
        const echo=window.Echo.join('global_channel')
        .listen('AgentLogInEvent',async (e:EchoEvent)=>{
            toast.info(e.notification.message);
            appendRecentNotifications(e.notification);
            await refreshCards();
        })
        .listen('AgentChangeStatusEvent',async (e:EchoEvent)=>{
            toast.info(e.notification.message);
            appendRecentNotifications(e.notification);
            await refreshCards();
            console.log(e);
        })
        .listen('AgentLogOutEvent',async (e:EchoEvent)=>{
            toast.info(e.notification.message);
            appendRecentNotifications(e.notification);
            await refreshCards();
            console.log(e);
        })
        .listen('AgentRegisteredEvent',(e:EchoEvent)=>{
            toast.info(e.notification.message);
            appendRecentNotifications(e.notification);
            console.log(e);
        }); 
        setEcho(echo    );
        return ()=>window.Echo.leave('global_channel');
    },[selectedTeam]);
    return (
        <></>
    )
}



export default EchoCointainer
