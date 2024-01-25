import TrackerLogTab from '@/Components/TrackerComponents/TrackerLogTab';
import TrackerMainTab from '@/Components/TrackerComponents/TrackerMainTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import TrackerLayout from '@/Layouts/TrackerLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react'
import React, { FC, useEffect, useMemo } from 'react'

export type TimeLog = {
    id: number;
    session_id: number;
    start_time: string;
    status: {id:number,name:string};
    status_id: number;
}

interface Props{
    log:TimeLog[];
}

const TrackerSession:FC<Props> = ({log}) => {

    
    const {user} = usePage<PageProps>().props.auth;
    const {statuses} = usePage<PageProps>().props;
    const [elapsedTime,setElapsedTime] = React.useState(0);
    
    const [totalTime,setTotalTime] = React.useState(0);

    const userStatus = useMemo(()=>(statuses.find(status=>status.id===user.status_id))?.name || "Internal Error",[user.status_id,statuses]);

    const latest = useMemo(()=>log[0],[log]);
    const timeIN = useMemo(()=>log[log.length-1],[log]);

    useEffect(()=>{
        const timer = setInterval(()=>{
            const start = new Date(latest.start_time).getTime();
            const end = new Date().getTime();
            setElapsedTime((end-start)/(1000*60));
            setTotalTime((end-new Date(timeIN.start_time).getTime())/(1000*60));
        },1000);
        return ()=>clearInterval(timer);
    },[latest,timeIN]);

    
    
    return (
        <>
            <Head title={userStatus} />
            <TrackerLayout>
                <div className='h-full w-full p-2.5 flex items-center justify-center  '>
                    
                    <Tabs defaultValue="main" className="border rounded p-2.5 min-w-[50rem] max-w-[50rem]  max-h-[20rem] overflow-y-hidden flex flex-col">
                        <TabsList>
                            <TabsTrigger value="main">Main</TabsTrigger>
                            <TabsTrigger value="timelog">Time Log</TabsTrigger>
                        </TabsList>
                        <TabsContent value="main">
                            <TrackerMainTab totalTime={totalTime} elapsed={elapsedTime} />
                        </TabsContent>
                        <TabsContent className='flex-1 overflow-y-auto relative flex ' value="timelog">
                            <TrackerLogTab totalTime={totalTime} logs={log} />
                        </TabsContent>
                    </Tabs>
                    
                </div>
            </TrackerLayout>
        </>
    )
}

export default TrackerSession