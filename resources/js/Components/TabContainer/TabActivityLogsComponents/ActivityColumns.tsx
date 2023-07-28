import { ColumnDef } from '@tanstack/react-table';
import React, { ReactNode } from 'react'
import formatDistanceToNow  from 'date-fns/formatDistanceToNow';
import ActivityCellActions from './ActivityCellActions';


export type ActivityTableColumn = {
    status:string;
    eastern:string;
    manila:string;
    duration:string;
    early_departure_reason?:string;
    overtime_reason?:string;
    special_project_remark?:string;
    user_id:string;
    id:string;
    session_id:string;
}


export const activityTableColumns: ColumnDef<ActivityTableColumn>[] = [
    {
        accessorKey: "status",
        header: "Status",
    },    
    {
        accessorKey: "eastern",
        header: "Eastern",
    },
    {
        accessorKey: "manila",
        header: "Manila",
    },
    {
        accessorKey: "duration",
        header: "Timestamp",
    },
    {
        accessorKey: "early_departure_reason",
        header: "Early Departure Reason",
        cell:({row})=>row.original.early_departure_reason||""
    },
    {
        accessorKey: "overtime_reason",
        header: "Overtime Reason",
        cell:({row})=>row.original.overtime_reason||""
    },
    {
        accessorKey: "special_project_remark",
        header: "Special Project Remark",
        cell:({row})=>row.original.special_project_remark||""
    },
    {
        header: "Actions",
        id:"actions",
        cell:({row})=><ActivityCellActions session_id={row.original.session_id} user_id={row.original.user_id.toString()} agent_log_id={row.original.id.toString()} />
    }
]