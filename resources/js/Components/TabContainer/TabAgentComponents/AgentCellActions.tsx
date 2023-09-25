import ReactLoader from '@/Components/ReactLoader';
import { Button } from '@/Components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { IAgentStatus, PageProps, User,  } from '@/types'
import axios from 'axios';
import {  parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import React, { FC,  useCallback,  useEffect, useMemo, useRef, useState } from 'react'
import { RiPictureInPictureLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import { LuEdit } from 'react-icons/lu';
import { usePage } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import useGetAgents from '@/Hooks/useGetAgents';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import useEditAgentDialog from '@/Hooks/useNewEditDialog';
import { useResignModal } from '@/Hooks/useResignModal';
import { Badge } from '@/Components/ui/badge';

interface AgentCellActionsProps{
    company_id:string;
    team_id:string;
    user_id:string;
    agent:User;
}
type logRow = IAgentStatus & {duration:string}

const AgentCellActions:FC<AgentCellActionsProps> = ({company_id,team_id,user_id,agent}) => {
    const {onOpen:OpenResignModal} = useResignModal();
    const {teams} = usePage<PageProps>().props;
    const [showLogDialog,setShowLogDialog] = useState(false);
    const [showTransferDialog,setShowTransferDialog] = useState(false);
    const [loadingLogs,setLoadingLogs] = useState(true);
    const [logs,setLogs]=useState<IAgentStatus[]>();
    const [name,setName]=useState<string>("");
    const [transferring,setTransferring] = useState(false);
    const {getAgents:FetchAgents} = useGetAgents();
    const {selectedTeam} = useSelectedTeam();
    const [transferToTeamId,setTransferToTeamId] = useState<string>();
    const {setShowEditAgentDialog} = useEditAgentDialog();
    const handleTransfer = useCallback(()=>{
        if(!selectedTeam) return;
        if(!transferToTeamId||transferToTeamId.length<1) return toast.info('Select Team to Tranfer to...');
        setTransferring(true);
        axios.post(route('agents.transfer'),{
            team_id:transferToTeamId,
            company_id
        })
        .then(async()=>{
            toast.success('Agent Transfered!');
            await FetchAgents(selectedTeam.id,"","");
            setShowTransferDialog(false);
        })
        .catch(()=>toast.error('Internal Error. Please try again'))
        .finally(()=>setTransferring(false));
    },[company_id,transferToTeamId]);

    useEffect(()=>{
        if(!showLogDialog)return;
        setLoadingLogs(true);
        axios.get(route('agents.status_logs',{
            company_id
        }))
        .then(({data})=>{
            setLogs(data.logs);
            setName(data.name);
        })
        .catch(()=>toast.error('Internal Error. Please try again'))
        .finally(()=>setLoadingLogs(false));
    },[showLogDialog]);

    return (
        <>
            <div className='flex items-center space-x-1.5 justify-end'>
                {
                    agent.is_resigned?<Button size='sm' type='button' className='cursor-default' variant="outline" >Agent Resigned</Button>:(<>
                        <Button onClick={()=>setShowLogDialog(true)} size='sm' variant='outline' className='font-semibold '>Recent Activity</Button>
                        <Button disabled={user_id===selectedTeam?.user_id.toString()} onClick={()=>setShowTransferDialog(true)} size='sm' variant='default' className='font-semibold '>Transfer</Button>
                        <Button onClick={()=>OpenResignModal(user_id)} disabled={user_id===selectedTeam?.user_id.toString() } variant='destructive' className='font-semibold' size='sm'>Has Resigned?</Button>
                        <Button onClick={()=>setShowEditAgentDialog(true,agent)} size='sm' variant='secondary' className='font-semibold '>Edit Info</Button>
                    </>)
                }
                
            </div>


            <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
                <DialogContent  className='!min-w-[28rem] !max-w-2xl !max-h-screen !overflow-y-auto'>
                    {
                        (loadingLogs)?<ReactLoader size={40} />:(
                            <>
                                <DialogHeader>
                                    <DialogTitle>{name}</DialogTitle>
                                    <DialogDescription>
                                        {company_id}
                                    </DialogDescription>
                                </DialogHeader>
                                <LogDialogContent statusLogs={logs||[]} />
                                <DialogFooter>
                                    <Button variant='outline' onClick={()=>setShowLogDialog(false)}>Close</Button>
                                </DialogFooter>
                            </>
                        )
                    }
                </DialogContent>
            </Dialog>


            <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
                <DialogContent  className='!min-w-[28rem] !max-w-2xl !max-h-screen !overflow-y-auto'>
        
                    <DialogHeader>
                        <DialogTitle>Transfer</DialogTitle>
                        <DialogDescription>
                            Transfer to Team:
                        </DialogDescription>
                    </DialogHeader>
                    <Select onValueChange={val=>setTransferToTeamId(val)} disabled={transferring}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Team to Transfer to..." />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                teams.map(({id,name})=><SelectItem disabled={id.toString()===team_id} key={id} value={id.toString()}>{name}</SelectItem>)
                            }
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <Button disabled={transferring} variant='outline' size='sm' onClick={()=>setShowTransferDialog(false)}>Close</Button>
                        <Button disabled={transferring} onClick={handleTransfer} variant='secondary' size='sm' >Transfer</Button>
                    </DialogFooter>
                        
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AgentCellActions

interface LogDialogContentProps{
    statusLogs:IAgentStatus[]
}

const LogDialogContent:FC<LogDialogContentProps> = ({statusLogs}) =>{

    const uniqueAgentSessionIds = [...new Set(statusLogs.map((sLog) => sLog.agent_session_id))].reverse();
    const tab1:IAgentStatus[]|null = uniqueAgentSessionIds[0]?statusLogs.filter(({agent_session_id})=>agent_session_id===uniqueAgentSessionIds[0]):null;
    const tab2:IAgentStatus[]|null = uniqueAgentSessionIds[1]?statusLogs.filter(({agent_session_id})=>agent_session_id===uniqueAgentSessionIds[1]):null;
    const tab3:IAgentStatus[]|null = uniqueAgentSessionIds[2]?statusLogs.filter(({agent_session_id})=>agent_session_id===uniqueAgentSessionIds[2]):null;
    
    
    const tab1Dates=useMemo(()=>[...new Set(tab1?.map((log) => formatInTimeZone( parseISO( log.created_at),'America/New_York','PPPP')))],[tab1]);
    const tab2Dates=useMemo(()=>[...new Set(tab2?.map((log) => formatInTimeZone( parseISO( log.created_at),'America/New_York','PPPP')))],[tab2]);
    const tab3Dates=useMemo(()=>[...new Set(tab3?.map((log) => formatInTimeZone( parseISO( log.created_at),'America/New_York','PPPP')))],[tab3]);
    
    const tab1Label:string = useMemo(()=> tab1Dates?.length>0? tab1Dates.length===2? `${tab1Dates[1]} - ${tab1Dates[0]}`:tab1Dates[0]:"No Data...",[tab1Dates]);
    const tab2Label:string = useMemo(()=> tab2Dates?.length>0? tab2Dates.length===2? `${tab2Dates[1]} - ${tab2Dates[0]}`:tab2Dates[0]:"No Data...",[tab2Dates]);
    const tab3Label:string = useMemo(()=> tab3Dates?.length>0? tab3Dates.length===2? `${tab3Dates[1]} - ${tab3Dates[0]}`:tab3Dates[0]:"No Data...",[tab3Dates]);
    
    

    return(
        <Tabs  defaultValue="tab1" className="text-sm">
            <TabsList>
                <TabsTrigger value="tab1">{tab1Label}</TabsTrigger>
                {tab2&&<TabsTrigger value="tab2">{tab2Label}</TabsTrigger>}
                {tab3&&<TabsTrigger value="tab3">{tab3Label}</TabsTrigger>}
            </TabsList>
            <TabsContent  value="tab1">
                <LogTable key={0} logs={tab1} dt={tab1Label}/>
            </TabsContent>
            <TabsContent value="tab2">
                <LogTable key={1} logs={tab2} dt={tab2Label}/>
            </TabsContent>
            <TabsContent value="tab3">
                <LogTable key={2} logs={tab3} dt={tab3Label}/>
            </TabsContent>
        </Tabs>
    );
}

interface LogTableProps{
    logs:IAgentStatus[]|null;
    dt:string
}

const LogTable:FC<LogTableProps> = ({logs,dt}) =>{
    if(!logs||logs.length<1){
        return(
            <div className='w-full items-center justify-center'>
                <div className='flex flex-col py-10 space-y-5 items-center justify-between'>
                    <RiPictureInPictureLine className='text-muted-foreground' size={30} />
                    <p className='text-lg font-bold tracking-wide text-center'>No Data...</p>
                </div>
            </div>
        )
    }
    
    
    
    const tblRows:logRow[] = useMemo(()=>logs.map((log,idx)=>{
        
        let duration = idx===0?"Logged In - ":"";
        if(log.status_id===10) {
            duration="Logged Out"
        }
        if(log.status_id!==10 && logs[idx+1]) {
            duration += differenceInMinutes(parseISO(logs[idx+1].created_at),parseISO(log.created_at),{roundingMethod:'ceil'}).toString() + ' mins.'
        }
        return {...log,duration};
    }),[logs]);


    return(
        <Table>
            <TableCaption>Date:&nbsp;{dt}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    {/* <TableHead className="text-right">Actions</TableHead> */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    tblRows.map(row=><LogTableItem key={row.id} row={row} />)
                }
                
            </TableBody>
        </Table>
    );
}

interface LogTableItem {
    row:logRow
}

const LogTableItem:FC<LogTableItem> = ({row}) =>{
    return (
        <TableRow key={row.id} className='text-xs'>
            <TableCell className="font-medium">{row.status.name}</TableCell>
            <TableCell>{formatInTimeZone( parseISO(row.created_at),'America/New_York','yyyy-MM-dd HH:mm zzz')}</TableCell>
            <TableCell>{row.duration}</TableCell>
            {/* <TableCell className="flex">
                <Button variant='secondary' size='icon' className='ml-auto'>
                    <LuEdit size={20} />
                </Button>
            </TableCell> */}
        </TableRow>
    );
}

