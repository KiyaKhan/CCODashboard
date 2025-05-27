
import { IAgentLogs, INotification } from '@/types';
import {create} from 'zustand'

export type AgentBreakdown={
    team_size:number;
    total_online:number;
    total_on_lunch_or_break:number;
    total_on_call:number;
    total_on_email:number;
}

export type BarChart = [
    {name:'calls',total:number},
    {name:'break',total:number},
    {name:'bio_break',total:number},
    {name:'lunch',total:number},
    {name:'training',total:number},
    {name:'coaching',total:number},
    {name:'meeting',total:number},
    {name:'system_issue',total:number},
    {name:'floor_support',total:number},
    {name:'special_assignment',total:number}
]
interface IDashboardInfo{
    recentNotifications?:INotification[];
    agentLogs?: IAgentLogs[];
    agentBreakdown?:AgentBreakdown;
    barChart?:BarChart;
    setAgentBreakdown:(agentBreakdown:AgentBreakdown)=>void;
    setRecentNotifications:(notifications:INotification[])=>void;
    appendRecentNotifications:(notification:INotification)=>void;
    setAgentLogs:(logs:IAgentLogs[]) => void;
    appendAgentLogs:(log:IAgentLogs) => void;
    setBarChart:(chart:BarChart)=>void;
}

const useDashboardInfo = create<IDashboardInfo>(set=>({
    agentBreakdown:undefined,
    recentNotifications:undefined,
    barChart:undefined,
    agentLogs:undefined,
    setRecentNotifications:(notifications)=>set({
        recentNotifications:notifications
    }),
    appendRecentNotifications:(notification)=>set(dashBoardItems=>({...dashBoardItems,recentNotifications:[notification,...(dashBoardItems.recentNotifications||[]).filter((n,i)=>i<5&&n)]})),
    setAgentBreakdown:(breakdown)=>set({
        agentBreakdown:breakdown
    }),
    setBarChart:(chart) => set({
        barChart:chart
    }),
    setAgentLogs:(logs) => set({
        agentLogs:logs
    }),
    // Prevent from duplicate record (id unique).
    appendAgentLogs: (log) => set(dashBoardItems=>({...dashBoardItems, agentLogs: [log, ...(dashBoardItems.agentLogs || []).filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))]})),
}));



export default useDashboardInfo