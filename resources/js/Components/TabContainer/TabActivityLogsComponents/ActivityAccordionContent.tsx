import React, { FC, useEffect, useMemo } from 'react'
import { LogsBySessionId } from '../TabActivityLogs'
import { ActivityTableColumn, activityTableColumns } from './ActivityColumns';
import { formatInTimeZone } from 'date-fns-tz';
import { differenceInMinutes, parseISO } from 'date-fns';
import { DataTable } from '@/Components/DataTable/DataTable';
import { Separator } from '@/Components/ui/separator';
import { minsToDuration } from '@/Pages/Index';

interface ActivityAccordionContentProps{
    log:LogsBySessionId;
}
type LogsBreakdown = {
    status:string;
    duration:string;
}
const ActivityAccordionContent:FC<ActivityAccordionContentProps> = ({log : AgentStatusLog}) => {
    const {logs} =AgentStatusLog;
    

    const activityTableData:ActivityTableColumn[] = useMemo(()=>logs.map((log,idx)=>{
        let duration = idx===0?"Logged In - ":"";
        if(log.status_id===10) {
            duration="Logged Out"
        }
        if(log.status_id!==10 && logs[idx+1]) {
            duration += differenceInMinutes(parseISO(logs[idx+1].created_at),parseISO(log.created_at)/*,{roundingMethod:'ceil'}*/).toString() + ' mins.'
        }

        return {
            status:log.status.name,
            eastern: formatInTimeZone(parseISO(log.created_at), 'America/New_York', 'yyyy-MM-dd HH:mm'),
            manila: formatInTimeZone(parseISO(log.created_at), 'Asia/Manila', 'yyyy-MM-dd HH:mm'),
            duration,
            early_departure_reason : log.early_departure_reason||"",
            special_project_remark : log.special_project_remark||"",
            overtime_reason : log.overtime_reason||"",
            user_id : log.user_id.toString(),
            id : log.id.toString(),
            session_id:log.agent_session_id.toString()

        }
    }),[logs]);

    const logsBreakdown:LogsBreakdown[]=useMemo(()=>{
        let bd=[];
        let calls=0;//1
        let emails=0;//2
        let Break=0;//3
        let bio_break=0;//4
        let lunch=0;//5
        let training=0;//6
        let coaching=0;//7
        let meeting=0;//8
        let system_issue=0;//9
        let floor_support=0;//11
        let special_assignment=0;//12
        logs.forEach((log,idx,data)=>{
            const nextIndex=idx+1;
            const nextData=data[nextIndex];
            
            if(nextData){
                if(log.status_id===1) calls=calls+differenceInMinutes(parseISO(nextData.created_at),parseISO(log.created_at)/*,{roundingMethod:'ceil'}*/);
                if(log.status_id===2) emails=emails+differenceInMinutes(parseISO(nextData.created_at),parseISO(log.created_at)/*,{roundingMethod:'ceil'}*/);
                if(log.status_id===3) Break=Break+differenceInMinutes(parseISO(nextData.created_at),parseISO(log.created_at)/*,{roundingMethod:'ceil'}*/);
                if(log.status_id===4) bio_break=bio_break+differenceInMinutes(parseISO(nextData.created_at),parseISO(log.created_at)/*,{roundingMethod:'ceil'}*/);
                if(log.status_id===5) lunch=lunch+differenceInMinutes(parseISO(nextData.created_at),parseISO(log.created_at)/*,{roundingMethod:'ceil'}*/);
                if(log.status_id===6) training=training+differenceInMinutes(parseISO(nextData.created_at),parseISO(log.created_at)/*,{roundingMethod:'ceil'}*/);
                if(log.status_id===7) coaching=coaching+differenceInMinutes(parseISO(nextData.created_at),parseISO(log.created_at)/*,{roundingMethod:'ceil'}*/);
                if(log.status_id===8) meeting=meeting+differenceInMinutes(parseISO(nextData.created_at),parseISO(log.created_at)/*,{roundingMethod:'ceil'}*/);
                if(log.status_id===9) system_issue=system_issue+differenceInMinutes(parseISO(nextData.created_at),parseISO(log.created_at)/*,{roundingMethod:'ceil'}*/);
                if(log.status_id===11) floor_support=floor_support+differenceInMinutes(parseISO(nextData.created_at),parseISO(log.created_at)/*,{roundingMethod:'ceil'}*/);
                if(log.status_id===12) special_assignment=special_assignment+differenceInMinutes(parseISO(nextData.created_at),parseISO(log.created_at)/*,{roundingMethod:'ceil'}*/);
            }
        });

        bd.push({status:'Calls',duration:minsToDuration(calls).toString()});
        bd.push({status:'Emails',duration:minsToDuration(emails).toString()});
        bd.push({status:'Break',duration:minsToDuration(Break).toString()});
        bd.push({status:'Bio Break',duration:minsToDuration(bio_break).toString()});
        bd.push({status:'Lunch',duration:minsToDuration(lunch).toString()});
        bd.push({status:'Training',duration:minsToDuration(training).toString()});
        bd.push({status:'Coaching',duration:minsToDuration(coaching).toString()});
        bd.push({status:'Meeting',duration:minsToDuration(meeting).toString()});
        bd.push({status:'System Issue',duration:minsToDuration(system_issue).toString()});
        bd.push({status:'Floor Support',duration:minsToDuration(floor_support).toString()});
        bd.push({status:'Special Assignment',duration:minsToDuration(special_assignment).toString()});
        return bd;

    },[logs]);
    
    return (
        <div className='flex flex-col space-y-1.5'>
            <DataTable columns={activityTableColumns} data={activityTableData} />
            <Separator className='' />
            <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6  gap-2.5 pt-3.5'>
                {
                    logsBreakdown.map(({status,duration})=> (
                        <div key={status} className='px-2.5 py-1.5 rounded-lg border border-muted-foreground flex items-center justify-between'>
                            <span>{status}:</span>
                            <span className='text-muted-foreground'>{duration}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ActivityAccordionContent