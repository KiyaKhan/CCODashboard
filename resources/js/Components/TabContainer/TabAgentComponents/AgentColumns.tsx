import { ColumnDef } from '@tanstack/react-table';
import React, { ReactNode } from 'react'
import AgentCellActions from './AgentCellActions';
import formatDistanceToNow  from 'date-fns/formatDistanceToNow';
import { IAgentSession, User } from '@/types';
import { differenceInSeconds } from 'date-fns';
import AgentSinceCell from './AgentSinceCell';
import AgentStatusCell from './AgentStatusCell';





export const agentColumns: ColumnDef<User>[] = [
    {
        header: "Company ID",
        cell:({row})=>row.original.company_id
    },
    {
        header: "Name",
        cell:({row})=>`${row.original.first_name} ${row.original.last_name}`
    },
    {
        header: "Site",
        cell:({row})=>`${row.original.site}`
    },
    {
        header: "Shift",
        cell:({row})=>`${row.original.shift_start.slice(0,-3)} - ${row.original.shift_end.slice(0,-3)}`
    },
    {
        header: "Team",
        cell:({row})=>(
            <div className='flex flex-col space-y-0.5 '>
                <span>{row.original?.group?.name || 'No Team'}</span>
                <span className='text-muted-foreground text-[0.7rem]'>{row.original.id===row.original.group.user_id?'Team Leader':'Agent'}</span>
            </div>
        )
    },
    {
        header: "Status",
        cell:({row})=>(
            <AgentStatusCell user={row.original} />
        )
    },
    {
        header: "Since",
        cell:({row})=> <AgentSinceCell statusId={row.original.status.id} timeStamp={new Date(row.original.updated_at)} />
    },
    {
        header: "",
        id:"actions",
        cell:({row})=><AgentCellActions agent={row.original} user_id={row.original.id.toString()} company_id={row.original.company_id} team_id={row.original.team_id.toString()} />
    }
]

