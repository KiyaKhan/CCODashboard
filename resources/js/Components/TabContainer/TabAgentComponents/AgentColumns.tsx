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
        header: "Actions",
        id:"actions",
        cell:({row})=><AgentCellActions company_id={row.original.company_id} />
    }
]