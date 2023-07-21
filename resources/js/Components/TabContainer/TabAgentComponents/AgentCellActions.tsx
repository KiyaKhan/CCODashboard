import ReactLoader from '@/Components/ReactLoader';
import { Button } from '@/Components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { IAgentStatus, User } from '@/types'
import axios from 'axios';
import React, { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

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
                <DialogContent>
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
    return(
        <Tabs defaultValue="today" className="">
            <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
            </TabsList>
            <TabsContent value="today">
                <LogTable />
            </TabsContent>
            <TabsContent value="yesterday">
                <LogTable />
            </TabsContent>
        </Tabs>
    );
}

const LogTable:FC = () =>{
    return(
        <Table>
            <TableCaption>Date:</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}

