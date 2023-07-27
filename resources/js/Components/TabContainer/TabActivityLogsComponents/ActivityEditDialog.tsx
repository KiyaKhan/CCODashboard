import ReactLoader from '@/Components/ReactLoader';
import { Button } from '@/Components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/Components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';


import useShowActivityEditDialog from '@/Hooks/useShowActivityEditDialog';
import { cn } from '@/Libs/Utils';
import { IAgentStatus, IStatus } from '@/types';
import axios from 'axios';
import React, {  ChangeEventHandler, FC, FocusEventHandler, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { BsCheckLg, BsFillQuestionDiamondFill } from 'react-icons/bs';
import { RiExpandUpDownFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { parseISO } from 'date-fns';
import { Separator } from '@radix-ui/react-select';
import { formatInTimeZone } from 'date-fns-tz';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';



const ActivityEditDialog:FC = () => {
    const {setShowActivityEditDialog,ShowActivityEditDialog,agentLogIdToEdit} = useShowActivityEditDialog();
    const [originalStatus,setOriginalStatus] = useState<IAgentStatus>();
    const [loadingStatus,setLoadingStatus] = useState(false);
    const [open,setOpen] = useState(false);
    const [statuses,setStatuses] = useState<IStatus[]>();
    const [time,setTime] = useState<{hh:string;mm:string;}>({hh:"01",mm:"00"});
    const [currentStatus,setCurrentStatus] = useState<IStatus>();

    const handleInputChange:ChangeEventHandler<HTMLInputElement> = useCallback(({target})=>{
        const { id,value } = target;
        if(value.length>2) return null;
        let t=value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        t=t.slice(0,2);
        t=t.length<3?t:t.padStart(2,"0");
        setTime(val=>({...val,[id]:t}));
    },[time]);

    const handleInputBlur:FocusEventHandler<HTMLInputElement> = useCallback(({target}) => {
        const { id,value } = target;
        let t=value;
        if(id==='hh'){
            t=(parseInt(t)>23?'23':t).padStart(2,"0");
        }
        if(id==='mm'){
            t=(parseInt(t)>59?'59':t).padStart(2,"0");
        }
        setTime(val=>({...val,[id]:t}));
    },[time]);

    const timeStamp = useMemo(()=>{
        if(!originalStatus) return;
        const {hh,mm} = time;
        const t = `${hh}:${mm}:00`;
        const ISODt=parseISO(originalStatus.created_at);
        const dt=`${ISODt.getFullYear().toString()}-${ISODt.getMonth().toString().padStart(2,"0")}-${ISODt.getDate().toString().padStart(2,"0")}`
        const wholeDt= `${dt} ${t}`;
        return parseISO(wholeDt);

    },[time,originalStatus]);

    useEffect(()=>{
        if(!ShowActivityEditDialog)return;
        if(!agentLogIdToEdit) return;
        setLoadingStatus(true);
        axios.get(route('agent_log.edit',{
            agent_log_id:agentLogIdToEdit
        }))
        .then(({data}:{data:{statuses:IStatus[];agent_log:IAgentStatus}})=>{
            const {statuses:Statuses,agent_log} = data;
            setStatuses(Statuses);
            setOriginalStatus(agent_log);
            setCurrentStatus(agent_log.status);
            const time=parseISO(agent_log.created_at);
            
            const hr=time.getHours().toString().padStart(2,"0");
            const mn=time.getMinutes().toString().padStart(2,"0");
            setTime({hh:hr,mm:mn});
        })
        .catch(e=>toast.error('Internal Error. Please try again.'))
        .finally(()=>setLoadingStatus(false));
    },[ShowActivityEditDialog]);
    

    const Content:ReactNode = useMemo(()=>(
        <>
            <DialogHeader>
                <DialogTitle>Edit Status</DialogTitle>
                <DialogDescription className='flex flex-col space-y-0.5'>
                    <p>
                        Agent:&nbsp;{originalStatus?`${originalStatus.user.first_name} ${originalStatus.user.last_name}, ${originalStatus.user.company_id}`:'Server Error...'}
                    </p>
                    <p>
                        {originalStatus? formatInTimeZone( parseISO( originalStatus.created_at),'America/New_York','yyyy-MM-dd HH:mm zzz') :'Server Error...'}
                    </p>
                    <p>
                        {originalStatus? formatInTimeZone( parseISO( originalStatus.created_at),'Asia/Manila','yyyy-MM-dd HH:mm zzz') :'Server Error...'}
                    </p>
                </DialogDescription>
            </DialogHeader>
            <div className='p-2.5 flex flex-col space-y-3.5'>
                <div className='flex flex-col space-y-2.5'>
                    <Label htmlFor='status' >Select Status:</Label>
                    <Popover  open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                            >
                            {statuses&&statuses
                                ? statuses.find(status=> status.name === currentStatus?.name)?.name
                                : "Select Status..."}
                            <RiExpandUpDownFill className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Command>
                                <CommandInput placeholder="Search Status..." />
                                <CommandEmpty>No Status found.</CommandEmpty>
                                <CommandGroup>
                                    {statuses&&statuses.map(status => (
                                    <CommandItem
                                        key={status.id}
                                        onSelect={val => {
                                        setCurrentStatus(val === status.name ? undefined : status)
                                        setOpen(false)
                                        }}>
                                            <BsCheckLg
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    currentStatus?.id === status.id ? "opacity-100" : "opacity-0"
                                                )}/>
                                            {status.name}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                
                <TimeInputToolTip>
                    <div className='flex flex-col space-y-1.5'>
                        <div className='flex items-center space-x-1.5'><span>TimeStamp: (PH)</span> <BsFillQuestionDiamondFill size={18} /> </div>
                            <div className='flex items-center justify-center space-x-1.5'>
                                <div className='flex items-center justify-center space-x-0.5'>
                                    <div className='hover:opacity-75 transition-opacity duration-300 flex flex-col justify-center items-center relative'>
                                        <Label htmlFor='hh' className='rounded-lg p-1.5 bg-neutral-300 text-black dark:invert absolute left-1 top-[8.5%]'>Hr.</Label>
                                        <Input max={23} min={0} type='number' className='pl-12' onFocus={({target})=>target.select()} onBlur={handleInputBlur} id="hh" value={time.hh} onChange={handleInputChange} />
                                        <p className='self-start ml-2.5 text-[0.65rem] text-muted-foreground'>0~23</p>
                                    </div>
                                    
                                </div>
                                <div className='hover:opacity-75 transition-opacity duration-300 flex items-center justify-center space-x-0.5'>
                                    <div className='flex flex-col justify-center items-center relative'>
                                        <Label htmlFor='mm' className='rounded-lg p-1.5 bg-neutral-300 text-black dark:invert absolute left-1 top-[8.5%]'>Min.</Label>
                                        <Input max={59} min={0} type='number' className='pl-12' onFocus={({target})=>target.select()} onBlur={handleInputBlur} id="mm" value={time.mm} onChange={handleInputChange} />
                                        <p className='self-start ml-2.5 text-[0.65rem] text-muted-foreground'>0~59</p>
                                    </div>
                                </div>
                            </div>
                    </div>
                </TimeInputToolTip>
                {
                    currentStatus&&currentStatus.id===10&&(
                        <>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor='early' >Early Departure Reason</Label>
                                <Input id='early' placeholder='(optional...)'/>
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor='ot' >Overtime Reason</Label>
                                <Input id='ot' placeholder='(optional...)'/>
                            </div>
                        </>
                    )
                }
                {
                    currentStatus&&currentStatus.id===12&&(
                        <>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor='sar' >Special Assignment Remarks</Label>
                                <Input id='sar' placeholder='(optional...)'/>
                            </div>
                        </>
                    )
                }
            </div>
            <DialogFooter>
                <Button variant='secondary' size='sm' className='font-semibold'>Cancel</Button>
                <Button variant='outline' size='sm' className='font-semibold'>Update</Button>
            </DialogFooter>
        </>
    ),[statuses,currentStatus,open,time]);

    return (
        <Dialog open={ShowActivityEditDialog} onOpenChange={setShowActivityEditDialog} >
            <DialogContent className='max-w-xs text-sm'>
                {loadingStatus? <div className='py-40'> <ReactLoader /> </div> :Content}
            </DialogContent>
        </Dialog>
    )
}

export default ActivityEditDialog;

const TimeInputToolTip:FC<{children:ReactNode}> = ({children}) =>{
    return(
        <TooltipProvider delayDuration={50}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side='bottom'>
                    <p className='font-semibold'>!! IMPORTANT !!</p>
                    <p>Please make sure you are using Manila Time.</p> 
                    <p>It will be automatically converted to Eastern Time when updating.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}