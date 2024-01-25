import { TimeLog } from '@/Pages/TrackerSession'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Table,TableCaption,TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
    TableFooter } from '../ui/table';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { minsToDuration } from '@/Pages/Index';

interface Props{
    logs:TimeLog[];
    totalTime:number;
}

const TrackerLogTab:FC<Props> = ({logs,totalTime}) => {


    return (
        <Table className=' h-full overflow-y-auto relative'>
            
            <TableHeader className=' sticky top-0 z-50 bg-background '>
                <TableRow>
                    <TableHead className='font-bold'>Status</TableHead>
                    <TableHead className='font-bold'>Start</TableHead>
                    <TableHead className='font-bold'>End</TableHead>
                    <TableHead className="text-right font-bold">Duration</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className=''>
                {logs.map((log,idx) => <TrackerLogTabTableRow key={idx} log={log} nextLog={logs[idx-1]} />)}
            </TableBody>
            <TableFooter className='font-bold text-lg sticky bottom-0 bg-background z-50 text-primary ' >
                <TableRow className=''>
                    <TableCell colSpan={3}>Your Time:</TableCell>
                    <TableCell className="text-right">{minsToDuration(totalTime)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export default TrackerLogTab;

interface TrackerLogTabTableRow{
    log:TimeLog;
    nextLog?:TimeLog;
}

const TrackerLogTabTableRow:FC<TrackerLogTabTableRow> = ({log,nextLog})=>{

    const duration = useMemo(()=>{
        const start = new Date(log.start_time).getTime();
        const end = new Date(nextLog?.start_time || new Date()).getTime();
        return (end-start)/(1000*60);
    },[log,nextLog])

    return (
        <TableRow>
            <TableCell className="font-medium">{log.status.name}</TableCell>
            <TableCell>{formatInTimeZone(new Date(log.start_time), 'America/New_York','yyyy-MM-dd HH:mm:ss zzz')}</TableCell>
            <TableCell>{nextLog?formatInTimeZone(new Date(nextLog.start_time), 'America/New_York','yyyy-MM-dd HH:mm:ss zzz'):''}</TableCell>
            <TableCell className="text-right">{ nextLog ? minsToDuration(duration) : '' }</TableCell>
        </TableRow>
    )
}