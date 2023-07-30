import { ColumnDef } from '@tanstack/react-table';
import React, { ReactNode } from 'react'
import AgentCellActions from './AgentCellActions';
import formatDistanceToNow  from 'date-fns/formatDistanceToNow';


export type AgentTableColumn = {
    company_id:string;
    name:string;
    site:string;
    status:string;
    team:string;
    since:string;
    team_id:string;
    user_id:string;
    team_leader_id:string;
}


export const agentColumns: ColumnDef<AgentTableColumn>[] = [
    {
        accessorKey: "company_id",
        header: "Company ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "site",
        header: "Site",
    },
    {
        accessorKey: "team",
        header: "Team",
        cell:({row})=>(
            <div className='flex flex-col space-y-0.5 items-center justify-center'>
                <span>{row.original.team}</span>
                <span className='text-muted-foreground text-[0.7rem]'>{row.original.user_id===row.original.team_leader_id?'Team Leader':'Agent'}</span>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "since",
        header: "Since",
        cell:({row})=>formatDistanceToNow(new Date(row.original.since))
    },
    {
        header: "",
        id:"actions",
        cell:({row})=><AgentCellActions user_id={row.original.user_id} company_id={row.original.company_id} team_id={row.original.team_id} />
    }
]