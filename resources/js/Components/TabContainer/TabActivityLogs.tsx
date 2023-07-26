import useSelectedTeam from '@/Hooks/useSelectedTeam';
import { IAgentStatus, User } from '@/types';
import axios from 'axios';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import { Loader } from './TabAgents';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { RiExpandUpDownLine } from 'react-icons/ri';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { BiCalendar, BiCheck } from 'react-icons/bi';
import { cn } from '@/Libs/Utils';
import { DateRange } from 'react-day-picker';
import { format, parseISO, subDays } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { BsSearch } from 'react-icons/bs';
import { formatInTimeZone } from 'date-fns-tz';
import ActivityAccordion from './TabActivityLogsComponents/ActivityAccordion';

type AgentPopoverData={
    id:number;
    name:string;
}

export interface LogsBySessionId  {
    sessionId:number;
    dates:string;
    logs:IAgentStatus[];
}

const TabActivityLogs:FC = () => {
    const {selectedTeam} = useSelectedTeam();
    const [agents,setAgents] = useState<User[]>();
    const [loading,setLoading] = useState(true);
    const [loadingSelectedAgent,setLoadingSelectedAgent] = useState(false);
    const [open,setOpen] = useState(false);
    const [logs,setLogs]=useState<LogsBySessionId[]>();
    const [selectedAgent,setSelectedAgent] = useState<AgentPopoverData>();
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: subDays(new Date(),2),
        to: new Date()
    })
    const agentPopoverData:AgentPopoverData[]|undefined = useMemo(()=>agents?.map(agent=>({id:agent.id,name:`${agent.first_name} ${agent.last_name}, ${agent.company_id}`})),[agents]);


    
    const logsBySessionId:(logs: IAgentStatus[]) => Promise<LogsBySessionId[]> = async (logs:IAgentStatus[]) =>{
        const uniqueAgentSessionIds:number[] = [...new Set(logs.map((log) => log.agent_session_id))].reverse();
        const logsPerId:LogsBySessionId[] = uniqueAgentSessionIds.map(sessionId=>{
            const logsByThisId:IAgentStatus[] = logs.filter(({agent_session_id})=>agent_session_id===sessionId);
            const datesOfThisId=[...new Set(logsByThisId.map((log) => formatInTimeZone( parseISO( log.created_at),'America/New_York','PPPP')))];
            const dateLabel = datesOfThisId.length===2? `${datesOfThisId[1]} - ${datesOfThisId[0]}`:datesOfThisId[0];
            return {
                sessionId,
                dates:dateLabel,
                logs:logsByThisId
            }
        });
        return logsPerId;
    };

    const getActivityLogs = useCallback(async ()=>{
        if(!selectedAgent) return toast.info('Select Agent First....');
        const {id} = selectedAgent;
        setLoadingSelectedAgent(true);
        try {
            const {data} = await axios.get(route('agents.status_logs_full',{id,dateRange})) as {data:IAgentStatus[]};
            const formattedLog = await logsBySessionId(data);
            setLogs(formattedLog);
        } catch (error) {
            toast.error('Internal Error. Please refresh the page');
        } finally{
            setLoadingSelectedAgent(false);
        }
        
    },[dateRange,selectedAgent,setLoadingSelectedAgent,logsBySessionId,setLogs]);


    
    useEffect(()=>{
        if(!selectedTeam) return;
        setLoading(true);
        axios.get(route('agents.index',{
            team_id:selectedTeam.id,
        }))
        .then(({data})=>setAgents(data))
        .catch(()=>toast.error('Internal Error. Please refresh the page'))
        .finally(()=>setLoading(false));
    },[]);

    if(loading) {
        return (
            <Loader />
        );
    }

    return (
        <div className='flex flex-col space-y-3.5'>
            <div className='flex flex-col space-y-2.5 md:flex-row md:space-y-0 md:space-x-2.5'>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger className='w-full md:w-5.5/12' asChild>
                        <Button
                            disabled={loadingSelectedAgent}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className=" justify-between"
                        >
                        {selectedAgent
                            ? agentPopoverData?.find((agent) => agent.id === selectedAgent.id)?.name
                            : "Select Agent..."}
                        <RiExpandUpDownLine className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                        <Command>
                            <CommandInput placeholder="Search agent by Name/Company ID..." />
                            <CommandEmpty>No Agent found.</CommandEmpty>
                            <CommandGroup>
                                {agentPopoverData?.map((agent) => (
                                <CommandItem
                                    key={agent.id}
                                    onSelect={(val) => {
                                    setSelectedAgent(agent.name === val ? undefined : agent)
                                    setOpen(false)
                                    }}
                                >
                                    <BiCheck
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedAgent?.name === agent.name ? "opacity-100" : "opacity-0"
                                    )}
                                    />
                                    {agent.name}
                                </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger className='w-full md:w-5.5/12' asChild>
                        <Button
                            disabled={loadingSelectedAgent}
                            id="date"
                            variant={"outline"}
                            className={cn(
                            " justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground"
                            )}
                        >
                            <BiCalendar className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Pick a date range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        disabled={loadingSelectedAgent}
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={1}
                    />
                    </PopoverContent>
                </Popover>
                <div className='w-full md:w-1/12 flex md:items-center md:justify-center'>
                    <Button disabled={loadingSelectedAgent} onClick={getActivityLogs} variant='secondary'  size='icon' className='hidden md:flex'><BsSearch size={18} /></Button>
                    <Button disabled={loadingSelectedAgent} onClick={getActivityLogs}  variant='secondary' className='md:hidden block flex-1 font-bold'>Proceed</Button>
                </div>
                
            </div>
            {logs&&<ActivityAccordion logsBySessionId={logs} />}
        </div>
    )
}

export default TabActivityLogs