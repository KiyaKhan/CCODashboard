import useSelectedTeam from '@/Hooks/useSelectedTeam';
import axios from 'axios';
import {FC,FormEventHandler,useEffect,useMemo,useState} from 'react'
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {  BsPlusCircle } from 'react-icons/bs';
import { AgentTableColumn, agentColumns } from './TabAgentComponents/AgentColumns';
import { PageProps, User } from '@/types';
import { DataTable } from '../DataTable/DataTable';
import { Input } from '../ui/input';
import { usePage } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BiCircle } from 'react-icons/bi'
import useEcho from '@/Hooks/useEcho';

const TabAgents:FC = () => {
    const {Echo} = useEcho();
    const {statuses} = usePage<PageProps>().props;
    const {selectedTeam,loadingTeam} = useSelectedTeam();
    const [loading,setLoading] = useState(false);
    const [agents,setAgents] = useState<User[]>();
    const [filters,setFilters] = useState("");
    const getAgents = (statusID?:string) =>{
        if(!selectedTeam)return ;
        setLoading(true);
        axios.get(route('agents.index',{
            team_id:selectedTeam.id,
            filter:filters,
            status_id:statusID||""
        }))
        .then(({data})=>setAgents(data))
        .catch(e=>toast.error('Internal Error. Please refresh the page then try again...'))
        .finally(()=>setLoading(false));
    }

    const onSubmit:FormEventHandler = (e) =>{
        e.preventDefault();
        getAgents();
    }

    

    const agentData:AgentTableColumn[]|undefined = useMemo(()=>agents?.map(({company_id,site,first_name,last_name,status,group,updated_at})=>({company_id,name:`${first_name} ${last_name}`,status:status.name,site,team:group.name,since:updated_at})),[agents])

    useEffect(()=>{
        getAgents();
    },[selectedTeam]);

    useEffect(()=>{
        Echo.listen('AgentLogInEvent',(e:any)=>{
            console.log('AgentLogInEvent from TabAgents.tsx');
        }); 
    },[]);

    if(!agentData||loading){
        return(
            <div className='w-full flex items-center justify-center'>
                <BiCircle size={96}  className='text-sky-500 animate-ping mt-48' />
            </div>
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
                
                <div className="flex items-center justify-between flex-1 lg:flex-none">
                    <Button className='font-semibold' >
                        <BsPlusCircle className='mr-1.5 h-5 w-5' />
                        <span>Add New Agent</span>
                    </Button>
                </div>
            </div>
            <Separator />
            <DataTable columns={agentColumns} data={agentData} />
        </>
    )
}

export default TabAgents