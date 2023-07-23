import ReactLoader from '@/Components/ReactLoader';
import { Button } from '@/Components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { IAgentStatus, IStatus, User } from '@/types'
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import React, { FC, useEffect, useMemo, useState } from 'react'
import { RiPictureInPictureLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import differenceInMinutes from 'date-fns/differenceInMinutes';

interface AgentCellActionsProps{
    company_id:string;
}

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
                <Button onClick={()=>setShowLogDialog(true)} size='sm' variant='outline'>Status Log</Button>
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
                                    <Button onClick={()=>setShowLogDialog(false)}>Close</Button>
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
    const todayData:IAgentStatus[]|null = uniqueAgentSessionIds[0]?statusLogs.filter(({agent_session_id})=>agent_session_id===uniqueAgentSessionIds[0]):null;
    const yesterdayData:IAgentStatus[]|null = uniqueAgentSessionIds[1]?statusLogs.filter(({agent_session_id})=>agent_session_id===uniqueAgentSessionIds[0]):null;
    const twoDaysAgoData:IAgentStatus[]|null = uniqueAgentSessionIds[2]?statusLogs.filter(({agent_session_id})=>agent_session_id===uniqueAgentSessionIds[0]):null;
    return(
        <Tabs  defaultValue="today" className="text-sm">
            <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
                <TabsTrigger value="2_days_ago">Two Days Ago</TabsTrigger>
            </TabsList>
            <TabsContent  value="today">
                <LogTable key={0} logs={todayData}/>
            </TabsContent>
            <TabsContent value="yesterday">
                <LogTable key={1} logs={yesterdayData}/>
            </TabsContent>
            <TabsContent value="2_days_ago">
                <LogTable key={2} logs={twoDaysAgoData}/>
            </TabsContent>
        </Tabs>
    );
}

interface LogTableProps{
    logs:IAgentStatus[]|null;
}

const LogTable:FC<LogTableProps> = ({logs}) =>{
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
    const dt = [...new Set(logs.map((log) => formatInTimeZone( parseISO( log.created_at),'America/New_York','PPPP')))].reverse();
    
    const dtlabel = useMemo(()=> dt.length===2? `${dt[1]} - ${dt[0]}`:dt[0], [dt]);
    const tblRows = useMemo(()=>logs.map((log,idx)=>{
        let duration= idx===0?"Logged In - ":"";
        if(log.status_id===10) {
            duration="Logged Out"
        }
        if(log.status_id!==10 ) {
            duration += differenceInMinutes(parseISO(logs[idx+1].created_at),parseISO(log.created_at)).toString() + ' mins.'
        }
        return {...log,duration};
    }),[logs]);


    return(
        <Table>
            <TableCaption>Date:&nbsp;{dtlabel}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    tblRows.map(row=>(
                        <TableRow key={row.id} className='text-xs'>
                            <TableCell className="font-medium">{row.status.name}</TableCell>
                            <TableCell>{formatInTimeZone( parseISO(row.created_at),'America/New_York','yyyy-MM-dd HH:mm zzz')}</TableCell>
                            <TableCell>{row.duration}</TableCell>
                            <TableCell className="flex">
                                <Button size='sm' className='ml-auto'>Save</Button>
                            </TableCell>
                        </TableRow>
                    ))
                }
                
            </TableBody>
        </Table>
    );
}

