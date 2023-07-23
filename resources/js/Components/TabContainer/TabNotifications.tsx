import useGetNotifications from '@/Hooks/useGetNotifications';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import { INotification } from '@/types';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Loader } from './TabAgents';
import {  formatDistanceToNow, parseISO } from 'date-fns';
import { format,formatInTimeZone } from 'date-fns-tz';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/Libs/Utils';
import { BsCalendarDateFill } from 'react-icons/bs';
import { Calendar } from '../ui/calendar';

const TabNotifications:FC = () => {
    const { getNotifications:FetchNotifications,setNotificationsTabOpen,notifications } =useGetNotifications();
    const {selectedTeam} = useSelectedTeam();
    const [loading,setLoading] = useState(true);
    const [date, setDate] = useState<Date>(new Date);


    const getAgents:()=>void = useCallback(async(statusID?:string) =>{
        if(!selectedTeam)return ;
        setLoading(true);
        await FetchNotifications(selectedTeam.id);
        setLoading(false);
    },[,selectedTeam,setLoading,FetchNotifications]);

    

    useEffect(()=>{getAgents();},[selectedTeam])

    useEffect(()=>{
        setNotificationsTabOpen(true);
        return()=>setNotificationsTabOpen(false);
    },[]);

    if(!notifications||loading){
        return <Loader />
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                    <BsCalendarDateFill className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(val)=>setDate(val!)}
                    initialFocus
                    />
                </PopoverContent>
            </Popover>
            <Table>
                <TableCaption>Notifications for this Team.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead>Notification</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Manila</TableHead>
                    <TableHead>EST</TableHead>
                    </TableRow>
                </TableHeader>
                    <TableBody>
                        {notifications.map((notification) => (
                            <NotificationTableRow key={notification.id} notification={notification} />
                        ))}
                    </TableBody>
                    
            </Table>
        </>
    )
}

export default TabNotifications;




interface NotificationTableRowProps {
    notification:INotification
}

const NotificationTableRow:FC<NotificationTableRowProps> = ({notification}) =>{
    const {message,created_at,user} = notification;
    const [fromNow,setFromNow] = useState(formatDistanceToNow(parseISO(created_at) ));
    useEffect(() => {
        const interval = setInterval(() => {
            setFromNow(formatDistanceToNow(parseISO(notification.created_at) ))
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    return(
        <TableRow>
            <TableCell className="font-medium">
                <div className='flex flex-col justify-center space-x-1.5'>
                    <p className='font-medium tracking-wide'>
                        {message}
                    </p>
                    <p className='font-light text-sm text-muted-foreground'>
                        {`${fromNow} ago`}
                    </p>
                </div>
                
            </TableCell>
            <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
            <TableCell>{ format(parseISO(created_at),'PP hh:mm a xxx') }</TableCell>
            <TableCell>{ formatInTimeZone(parseISO(created_at),'America/New_York','PP hh:mm a xxx') }</TableCell>
        </TableRow>
    )
}