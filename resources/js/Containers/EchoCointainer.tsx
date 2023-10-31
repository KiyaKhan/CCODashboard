import useCurrentUser from '@/Hooks/useCurrentUser';
import useDashboardInfo from '@/Hooks/useDashboardInfo';
import useEcho from '@/Hooks/useEcho';
import useGetAgents from '@/Hooks/useGetAgents';
import useGetNotifications from '@/Hooks/useGetNotifications';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import useToggleNotification from '@/Hooks/useToggleNotification';
import { INotification, PageProps, User } from '@/types';
import axios from 'axios';
import { FC, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

type EchoEvent ={
    notification:INotification;
    user:User;
}

const EchoCointainer:FC = () => {
    const {showNotif} = useToggleNotification();
    const {setEcho} = useEcho();
    const {appendRecentNotifications,setAgentBreakdown,setBarChart} = useDashboardInfo();
    const {selectedTeam} = useSelectedTeam();
    const { previousFilters,previousStatusId,getAgents,isAgentsTabOpen } =useGetAgents();
    
    const { getNotifications,isNotificationsTabOpen } =useGetNotifications();
    const refreshCards = useCallback(async() =>{
        if(!selectedTeam) return;
        axios.get(route('get_card_data',{
            team_id:selectedTeam.id
        }))
        .then(({data})=>setAgentBreakdown(data))
        .catch(e=>toast.error('Something went wrong. Please refresh the page'))
    },[selectedTeam,setAgentBreakdown]);


    const refreshBar = useCallback(async() =>{
        if(!selectedTeam) return;
        axios.get(route('get_bar_chart_data',{
            team_id:selectedTeam.id
        }))
        .then(({data})=>setBarChart(data))
        .catch(e=>toast.error('Something went wrong. Please refresh the page'))
    },[selectedTeam,setAgentBreakdown]);
    

    useEffect(()=>{
        
        setEcho(null);
        const echo=window.Echo.join('global_channel')
        .listen('AgentLogInEvent', (e:EchoEvent)=>{
            if (showNotif) toast.info(e.notification.message);
            appendRecentNotifications(e.notification);
            refreshCards();
            refreshBar();
            if(isAgentsTabOpen && selectedTeam)getAgents(selectedTeam.id,previousFilters,previousStatusId);
            if(isNotificationsTabOpen && selectedTeam)getNotifications(selectedTeam.id);

        })
        .listen('AgentChangeStatusEvent', (e:EchoEvent)=>{
            if (showNotif) toast.info(e.notification.message);
            appendRecentNotifications(e.notification);
            refreshCards();
            refreshBar();
            if(isAgentsTabOpen && selectedTeam)getAgents(selectedTeam.id,previousFilters,previousStatusId);
            if(isNotificationsTabOpen && selectedTeam)getNotifications(selectedTeam.id);
            

        })
        .listen('AgentLogOutEvent', (e:EchoEvent)=>{
            if (showNotif) toast.info(e.notification.message);
            appendRecentNotifications(e.notification);
            refreshCards();
            refreshBar();
            if(isAgentsTabOpen && selectedTeam)getAgents(selectedTeam.id,previousFilters,previousStatusId);
            if(isNotificationsTabOpen && selectedTeam)getNotifications(selectedTeam.id);

        })
        .listen('AgentRegisteredEvent',(e:EchoEvent)=>{
            if (showNotif) toast.info(e.notification.message);
            appendRecentNotifications(e.notification);
            refreshBar();
            if(isAgentsTabOpen && selectedTeam)getAgents(selectedTeam.id,previousFilters,previousStatusId);
            if(isNotificationsTabOpen && selectedTeam)getNotifications(selectedTeam.id);

        }); 
        setEcho(echo);
        return ()=>window.Echo.leave('global_channel');
    },[selectedTeam,previousFilters,previousStatusId,isAgentsTabOpen,isNotificationsTabOpen]);
    return (
        <></>
    )
}



export default EchoCointainer
