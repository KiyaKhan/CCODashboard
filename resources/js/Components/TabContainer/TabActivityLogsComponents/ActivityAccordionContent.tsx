import React, { FC, useMemo } from 'react'
import { LogsBySessionId } from '../TabActivityLogs'
import { ActivityTableColumn, activityTableColumns } from './ActivityColumns';
import { formatInTimeZone } from 'date-fns-tz';
import { differenceInMinutes, parseISO } from 'date-fns';
import { DataTable } from '@/Components/DataTable/DataTable';

interface ActivityAccordionContentProps{
    log:LogsBySessionId;
}

const ActivityAccordionContent:FC<ActivityAccordionContentProps> = ({log : AgentStatusLog}) => {
    const {logs} =AgentStatusLog;
    

    const activityTableData:ActivityTableColumn[] = useMemo(()=>logs.map((log,idx)=>{
        let duration = idx===0?"Logged In - ":"";
        if(log.status_id===10) {
            duration="Logged Out"
        }
        if(log.status_id!==10 && logs[idx+1]) {
            duration += differenceInMinutes(parseISO(logs[idx+1].created_at),parseISO(log.created_at),{roundingMethod:'ceil'}).toString() + ' mins.'
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
    }),[logs])

    return (
        <div>
            <DataTable columns={activityTableColumns} data={activityTableData} />
        </div>
    )
}

export default ActivityAccordionContent