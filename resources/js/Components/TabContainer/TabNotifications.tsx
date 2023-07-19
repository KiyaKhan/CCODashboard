import useGetNotifications from '@/Hooks/useGetNotifications';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import { INotification } from '@/types';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Loader } from './TabAgents';
import {  formatDistanceToNow, parseISO } from 'date-fns';
import { format,formatInTimeZone } from 'date-fns-tz';

const TabNotifications:FC = () => {
    const { getNotifications:FetchNotifications,setNotificationsTabOpen,notifications } =useGetNotifications();
    const {selectedTeam} = useSelectedTeam();
    const [loading,setLoading] = useState(true);


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
    )
}

export default TabNotifications

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