



/*

id: number;
    user_id: number;
    title:string;
    content:string;
    image?:string;
    status:number;
    user:User;
*/

import { Button } from "@/Components/ui/button";
import { TableHead } from "@/Components/ui/table";
import { LogData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { RiArrowLeftRightFill } from "react-icons/ri";

export const EmailLogColumn

    : ColumnDef<LogData>[] = [
        {
            accessorKey: "createdAt",
            header: ({ column }) => <Button className='w-full text-primary px-0' variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Date<RiArrowLeftRightFill className="ml-2 h-4 w-4 rotate-90" /></Button>,
            cell: ({ row }) => <p className="font-semibold tracking-wide">{row.original.createdAt}</p>
        },
        {
            accessorKey: "fullName",
            id: 'fullName',
            header: 'Agent',
            cell: ({ row }) => <p>{row.original.fullName}</p>
        },
        {
            accessorKey: "type",
            id: 'type',
            header: 'Type',
            cell: ({ row }) => <p>{row.original.type}</p>
        },
        {
            accessorKey: "driver",
            id: 'driver',
            header: 'Driver',
            cell: ({ row }) => <p>{row.original.driver}</p>
        },
        {
            accessorKey: "details",
            id: 'details',
            header: 'Details',
            cell: ({ row }) => <p>{row.original.details}</p>
        },
        {
            accessorKey: "start",
            id: 'start',
            header: 'Start Time',
            cell: ({ row }) => <>{row.original.start}</>
        },
        {
            accessorKey: "end",
            id: 'end',
            header: 'End Time',
            cell: ({ row }) => <>{row.original.end}</>
        },
        {
            accessorKey: "duration",
            id: 'duration',
            header: ({ column }) => <Button className='w-full text-primary px-0' variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Duration<RiArrowLeftRightFill className="ml-2 h-4 w-4 rotate-90" /></Button>,
            cell: ({ row }) => <div className="text-right pr-5">{row.original.duration}</div>
        },
    ]
