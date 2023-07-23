import ReactLoader from '@/Components/ReactLoader';
import { Button } from '@/Components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { IAgentStatus, PageProps,  } from '@/types'
import axios from 'axios';
import {  parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import React, { FC,  useEffect, useMemo, useRef, useState } from 'react'
import { RiPictureInPictureLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import { LuEdit } from 'react-icons/lu';
import { usePage } from '@inertiajs/react';

interface AgentCellActionsProps{
    company_id:string;
}
type logRow = IAgentStatus & {duration:string}

const AgentCellActions:FC<AgentCellActionsProps> = ({company_id}) => {
    const [showLogDialog,setShowLogDialog] = useState(false);
    const [loadingLogs,setLoadingLogs] = useState(true);
    const [logs,setLogs]=useState<IAgentStatus[]>();
    const [name,setName]=useState<string>("");
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
    },[showLogDialog])

    return (
        <>
            <div className='flex items-center space-x-1.5'>
                <Button onClick={()=>setShowLogDialog(true)} size='sm' variant='outline'>Recent Activity</Button>
                <Button size='sm' variant='destructive'>Delete</Button>
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
        </>
    )
}

export default AgentCellActions

interface LogDialogContentProps{
    statusLogs:IAgentStatus[]
}

const LogDialogContent:FC<LogDialogContentProps> = ({statusLogs}) =>{

    const uniqueAgentSessionIds = [...new Set(statusLogs.map((sLog) => sLog.agent_session_id))];
    const tab1:IAgentStatus[]|null = uniqueAgentSessionIds[0]?statusLogs.filter(({agent_session_id})=>agent_session_id===uniqueAgentSessionIds[0]):null;
    const tab2:IAgentStatus[]|null = uniqueAgentSessionIds[1]?statusLogs.filter(({agent_session_id})=>agent_session_id===uniqueAgentSessionIds[1]):null;
    const tab3:IAgentStatus[]|null = uniqueAgentSessionIds[2]?statusLogs.filter(({agent_session_id})=>agent_session_id===uniqueAgentSessionIds[2]):null;
    
    
    const tab1Dates=useMemo(()=>[...new Set(tab1?.map((log) => formatInTimeZone( parseISO( log.created_at),'America/New_York','PPPP')))].reverse(),[tab1]);
    const tab2Dates=useMemo(()=>[...new Set(tab2?.map((log) => formatInTimeZone( parseISO( log.created_at),'America/New_York','PPPP')))].reverse(),[tab2]);
    const tab3Dates=useMemo(()=>[...new Set(tab3?.map((log) => formatInTimeZone( parseISO( log.created_at),'America/New_York','PPPP')))].reverse(),[tab3]);
    
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
    if(!logs){
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
        if(log.status_id!==10 ) {
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

