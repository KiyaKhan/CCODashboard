import useSelectedTeam from '@/Hooks/useSelectedTeam';
import axios from 'axios';
import React, { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Loader } from './TabAgents';
import { Separator } from '../ui/separator';

type Lates={
    user_id:number;
    company_id:string;
    agent:string;
    log_in_date:string;
    log_in_time:string;
    shift_start:string;
    shift_end:string;
    late_mins:number;
    late_time:string;
}

const TabLates:FC = () => {
  
    const {selectedTeam} = useSelectedTeam();
    const [loading,setLoading] = useState(false);
    
    const [lates,setLates] = useState<Lates[]>([]);
    useEffect(()=>{
        
        setLoading(true);
        const team_id=selectedTeam?.id??0;
        axios.get(route('teams.lates',{team_id}))
        .then(({data}:{data:Lates[]})=>setLates(data.reverse()))
        .catch(e=>toast.error('Something went wrong. Please refresh the page'))
        .finally(()=>setLoading(false));
    },[selectedTeam]);

    if(loading){
        return(
            <Loader />
        );
    }

    return (
        <div className='flex'>
            
            <div className='max-w-4xl mx-auto w-full'>
                <h1 className='text-foreground text-lg font-semibold'>Lates</h1>
                <Separator />
                <table className='w-full'>
                    <thead>
                        <tr className='text-muted-foreground'>
                            <td className='w-[1/5]'>Agent</td>
                            <td className='w-[1/5]'>Date</td>
                            <td className='w-[1/5]'>Shift Start Sched</td>
                            <td className='w-[1/5]'>Login Time</td>
                            <td className='w-[1/5]'>Late Minutes</td>
                        </tr>
                    </thead>
                    <tbody>
                        {lates?.map(late=><LateRow key={late.user_id} late={late} />)}
                    </tbody>
                    
                </table>
            </div>
            
        </div>
    )
}

export default TabLates

const LateRow:FC<{late:Lates}> = ({late}) =>{
    return (
        <tr>
            <td>{late.agent}</td>
            <td>{late.log_in_date}</td>
            <td>{late.shift_start}</td>
            <td>{late.log_in_time}</td>
            <td>{late.late_mins}</td>
        </tr>
    );
}