import { User } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import TeamCellActions from './TeamCellActions';


export type TeamTableColumn = {
    id:number;
    team_leader:User;
    name:string;
    size:number;
    members:User[];

}


export const teamColumns: ColumnDef<TeamTableColumn>[] = [
    {
        accessorKey: "team_leader",
        header: "Team Leader",
        cell:({row})=>(
            <div className='flex flex-col space-y-0.5 items-start justify-center'>
                <p className='text-base'>{`${row.original.team_leader.first_name} ${row.original.team_leader.last_name}`}</p>
                <span className='text-sm text-muted-foreground'>{row.original.team_leader.company_id}</span>
            </div>
        )
    },
    {
        accessorKey: "name",
        header: "Team Name",
    },
    {
        accessorKey: "size",
        header: "Team Size",
    },
    {
        header: "",
        id:"actions",
        cell:({row})=><TeamCellActions members={row.original.members} team_id={row.original.id} leader={row.original.team_leader} name={row.original.name} />
    }
]