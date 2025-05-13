import useSelectedTeam from '@/Hooks/useSelectedTeam';
import {FC,FormEventHandler,useEffect,useMemo,useState} from 'react'
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {  BsPlusCircle } from 'react-icons/bs';
import { agentColumns } from './TabAgentComponents/AgentColumns';
import { PageProps, User } from '@/types';
import { DataTable } from '../DataTable/DataTable';
import { Input } from '../ui/input';
import { usePage } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BiCircle } from 'react-icons/bi';
import useGetAgents from '@/Hooks/useGetAgents';
import {useCallback} from 'react';

const TabAgents:FC = () => {
    const {statuses} = usePage<PageProps>().props;
    const {selectedTeam} = useSelectedTeam();
    const [loading,setLoading] = useState(true);
    const [filters,setFilters] = useState("");
    const {getAgents:FetchAgents,setAgentsTabOpen,agents} = useGetAgents();
    const getAgents = useCallback(async(statusID?:string) =>{
        if(!selectedTeam)return ;
        setLoading(true);
        await FetchAgents(selectedTeam.id,filters,statusID||"");
        setLoading(false);
    },[,selectedTeam,setLoading,FetchAgents,filters]);

    const onSubmit:FormEventHandler = (e) =>{
        e.preventDefault();
        getAgents();
    }

    

    useEffect(()=>{
        getAgents();
    },[selectedTeam]);

    useEffect(()=>{
        setAgentsTabOpen(true);
        return()=>setAgentsTabOpen(false);
    },[]);


    const nonResignedAgents = useMemo(()=>{
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return agents;
        // return agents?.filter(a=>{
        //     if(a.is_resigned!==1) return true;
        //     const updateDate = new Date(a.updated_at);
        //     if((updateDate>=thirtyDaysAgo)&&a.is_resigned===1) return true;
        //     return false;
        // });

    },[agents]);

    if(!nonResignedAgents){
        return(
            <Loader />
        )
    }

    return (
        <>
            <div className='flex flex-col lg:flex-row space-y-2.5 lg:space-y-0 lg:justify-between'>
                <div className="flex items-center space-x-3.5 py-4">
                    <form onSubmit={onSubmit}>
                        <Input
                            disabled={loading}
                            placeholder="Search Company ID/Name..."
                            value={filters}
                            onChange={({target}) =>setFilters(target.value)}
                            className="max-w-sm"
                            />
                    </form>
                    <Select onValueChange={e=>getAgents(e)} disabled={loading}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter Status..." />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem  value="">Any...</SelectItem>
                            {
                                statuses.map(({name,id})=>(
                                    <SelectItem key={id} value={id.toString()}>{name}</SelectItem>))
                            }
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Separator />
            <div className='min-w-[48rem]  overflow-x-auto'>{!loading?<DataTable columns={agentColumns} data={nonResignedAgents} />:<Loader />}</div>
        </>
    )
}

export default TabAgents

export const Loader:FC = () =>{
    return(
        <div className='w-full flex items-center justify-center'>
            <BiCircle size={96}  className='text-sky-500 animate-ping mt-48' />
        </div>
    )
}



