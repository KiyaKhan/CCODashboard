import useGetAgents from '@/Hooks/useGetAgents'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Loader } from './TabAgents';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import { differenceInMinutes, differenceInSeconds, format, parseISO } from 'date-fns';
import { IStatus, User } from '@/types';
import { minsToDuration } from '@/Pages/Index';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { IAgentStatus } from '../../types/index';
import ReactLoader from '../ReactLoader';
import { formatInTimeZone } from 'date-fns-tz';
import { Separator } from '../ui/separator';

const TabOverbreak:FC = () => {
    const {agents,getAgents,previousFilters,previousStatusId,setAgentsTabOpen} = useGetAgents();    
    const {selectedTeam} = useSelectedTeam();
    const [open,setOpen] = useState(false);



    useEffect(()=>{
        getAgents(selectedTeam?.id||0,previousFilters,previousStatusId);
        //getOverBreaks();
    },[selectedTeam?.id]);



    const currentOverBreaks = useMemo(()=>{
        const onBreakAgents = agents?.filter(agent=>(agent.status.id==3||agent.status.id==4||agent.status.id==5));
        return onBreakAgents?.filter(agent=> 
            
            ((agent.status.id===3 && differenceInMinutes(new Date(),new Date(agent.updated_at))>15) 
            ||(agent.status.id===4 && differenceInMinutes(new Date(),new Date(agent.updated_at))>5) 
            ||(agent.status.id===5 && differenceInMinutes(new Date(),new Date(agent.updated_at))>60))  
        );
        //return onBreakAgents;
    },[agents]);

    useEffect(()=>{
        setAgentsTabOpen(true);
        return()=>setAgentsTabOpen(false);
    },[]);

    if(!agents){
        return(
            <Loader />
        )
    }

    return (
        <>
            <div className='flex flex-col w-full h-full'>
                <Button size='sm' className='ml-auto font-semibold' onClick={()=>setOpen(true)}>Over Break/Lunch Logs</Button>
                <div className='max-w-4xl mx-auto w-full'>
                    <h1 className='text-foreground text-lg font-semibold'>Current Over Breaks/Lunch</h1>
                    
                    <Separator />
                    <table className='w-full'>
                        <thead>
                            <tr className='text-muted-foreground text-lg'>
                                <td className='w-[1/5]'>Agent</td>
                                <td className='w-[1/5]'>Break</td>
                                <td className='w-[1/5]'>Break Start</td>
                                <td className='w-[1/5]'>Duration</td>
                                <td className='w-[1/5]'>Over</td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOverBreaks?.map(agent=><CurrentOverBreakRow key={agent.id} agent={agent} />)}
                        </tbody>
                    </table>
                </div>
                
            </div>
            <OverBreakLogDialog onOpenChange={()=>setOpen(false)} open={open} teamId={selectedTeam?.id} />
        </>
    )
}

export default TabOverbreak

const CurrentOverBreakRow:FC<{agent:User}> = ({agent}) =>{
    const dt=new Date(agent.updated_at);
    const [diffInMins,setDiffInMins] = useState(differenceInSeconds(new Date(),dt)/60);
    const duration=useMemo(()=>minsToDuration(diffInMins),[diffInMins]);
    const over=useMemo(()=>{
        let limit=15;
        if(agent.status.id===5) limit=60;
        if(agent.status.id===4) limit=5;
        if(agent.status.id===3) limit=15;
        return minsToDuration(diffInMins-limit)
    },[diffInMins,agent.status.id]);
    useEffect(() => {
        const interval = setInterval(() => {
            setDiffInMins(differenceInSeconds(new Date(),dt)/60);
        }, 1000);
        return () => clearInterval(interval);
    }, [dt]);
    return(
        <tr>
            <td>
                {`${agent.first_name} ${agent.last_name}`}
            </td>
            <td>
                {agent.status.name}
            </td>
            <td>
                {format(new Date(agent.updated_at),'Pp')}
            </td>
            <td>
                {duration}
            </td>
            <td>
                {over}
            </td>
        </tr>
    )
}

interface OverBreakLogDialogProps{
    open?:boolean;
    teamId?:number;
    onOpenChange:()=>void;
}

type OverBreak={
    id:number; 
    user_id:number;
    user:User;
    status_id:number;
    status:IStatus; 
    agent_session_id:number; 
    overtime_reason:string|null; 
    early_departure_reason:string|null; 
    special_project_remark:string|null;
    created_at:string; 
    updated_at:string;
    break_duration:number;
    break_end:string;
}


const OverBreakLogDialog:FC<OverBreakLogDialogProps> = ({open,teamId,onOpenChange}) =>{
    const [loading,setLoading]=useState(false);
    const [overBreaks,setOverBreaks] = useState<OverBreak[]>();
    
    useEffect(()=>{
        if(!open) return;
        setLoading(true);
        const team_id=teamId??0;
        axios.get(route('teams.overbreaks',{team_id}))
        .then(({data}:{data:OverBreak[]})=>setOverBreaks(data.reverse()))
        .catch(e=>toast.error('Something went wrong. Please refresh the page'))
        .finally(()=>setLoading(false));
    },[open,teamId])

    return(
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className='max-w-4xl max-h-screen overflow-y-auto'>
                <DialogHeader>
                <DialogTitle>Previous Overbreaks</DialogTitle>
                <DialogDescription>
                    Over Break/Lunch Logs
                </DialogDescription>
                {
                    loading?<ReactLoader />:
                    <div>
                        <table className='w-full'>
                            <thead>
                                <tr className='text-muted-foreground'>
                                    <td className='w-[1/5]'>Agent</td>
                                    <td className='w-[1/5]'>Break</td>
                                    
                                    <td className='w-[1/5]'>Break Start (PH)</td>
                                    <td className='w-[1/5]'>Break End (PH)</td>
                                    <td className='w-[1/5]'>Duration</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    overBreaks?.map(({id,user,status,break_duration,break_end,...overBreak})=>(
                                        <tr key={id}>
                                            <td>{`${user.first_name} ${user.last_name}`}</td>
                                            <td>{`${status.name}`}</td>
                                            
                                            <td>{formatInTimeZone(parseISO(overBreak.created_at), 'Asia/Manila', 'yyyy-MM-dd HH:mm')}</td>
                                            <td>{formatInTimeZone(parseISO(break_end), 'Asia/Manila', 'yyyy-MM-dd HH:mm')}</td>
                                            <td>{break_duration.toString()+ ' mins.'}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                }
                
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}