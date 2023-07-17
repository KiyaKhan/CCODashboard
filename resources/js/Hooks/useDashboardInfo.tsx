
import { INotification } from '@/types';
import {create} from 'zustand'

export type AgentBreakdown={
    team_size:number;
    total_online:number;
    total_on_lunch_or_break:number;
    total_on_call:number;
    total_on_email:number;
}

interface IDashboardInfo{
    recentNotifications?:INotification[];
    agentBreakdown?:AgentBreakdown;
    setAgentBreakdown:(agentBreakdown:AgentBreakdown)=>void;
    setRecentNotifications:(notifications:INotification[])=>void;
    appendRecentNotifications:(notification:INotification)=>void;
}

const useDashboardInfo = create<IDashboardInfo>(set=>({
    agentBreakdown:undefined,
    recentNotifications:undefined,
    setRecentNotifications:(notifications)=>set({
        recentNotifications:notifications
    }),
    appendRecentNotifications:(notification)=>set(dashBoardItems=>({...dashBoardItems,recentNotifications:[notification,...(dashBoardItems.recentNotifications||[]).filter((n,i)=>i<5&&n)]})),
    setAgentBreakdown:(breakdown)=>set({
        agentBreakdown:breakdown
    }),
}));



export default useDashboardInfo