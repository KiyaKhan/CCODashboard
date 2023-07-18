import useCurrentUser from '@/Hooks/useCurrentUser';
import useDashboardInfo from '@/Hooks/useDashboardInfo';
import useEcho from '@/Hooks/useEcho';
import useGetAgents from '@/Hooks/useGetAgents';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import { INotification, PageProps, User } from '@/types';
import axios from 'axios';
import { FC, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

type EchoEvent ={
    notification:INotification;
    user:User;
}

const EchoCointainer:FC = () => {
    
    const {setEcho} = useEcho();
    const {appendRecentNotifications,setAgentBreakdown,setBarChart} = useDashboardInfo();
    const {selectedTeam} = useSelectedTeam();
    const { previousFilters,previousStatusId,getAgents,isAgentsTabOpen } =useGetAgents();
    const refreshCards = useCallback(async() =>{
        console.log(selectedTeam);
        if(!selectedTeam) return;
        axios.get(route('get_card_data',{
            team_id:selectedTeam.id
        }))
        .then(({data})=>setAgentBreakdown(data))
        .catch(e=>toast.error('Something went wrong. Please refresh the page'))
    },[selectedTeam,setAgentBreakdown]);


    const refreshBar = useCallback(async() =>{
        console.log(selectedTeam);
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
            toast.info(e.notification.message);
            appendRecentNotifications(e.notification);
            refreshCards();
            refreshBar();
            if(isAgentsTabOpen)getAgents(selectedTeam!.id,previousFilters,previousStatusId)

        })
        .listen('AgentChangeStatusEvent', (e:EchoEvent)=>{
            toast.info(e.notification.message);
            appendRecentNotifications(e.notification);
            refreshCards();
            refreshBar();
            if(isAgentsTabOpen)getAgents(selectedTeam!.id,previousFilters,previousStatusId)

        })
        .listen('AgentLogOutEvent', (e:EchoEvent)=>{
            toast.info(e.notification.message);
            appendRecentNotifications(e.notification);
            refreshCards();
            refreshBar();
            if(isAgentsTabOpen)getAgents(selectedTeam!.id,previousFilters,previousStatusId)

        })
        .listen('AgentRegisteredEvent',(e:EchoEvent)=>{
            toast.info(e.notification.message);
            appendRecentNotifications(e.notification);
            refreshBar();
            if(isAgentsTabOpen)getAgents(selectedTeam!.id,previousFilters,previousStatusId)

        }); 
        setEcho(echo    );
        //return ()=>window.Echo.leave('global_channel');
    },[selectedTeam,previousFilters
        ,previousStatusId,isAgentsTabOpen]);
    return (
        <></>
    )
}



export default EchoCointainer
