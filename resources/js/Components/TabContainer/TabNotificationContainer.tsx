import React, { FC, useCallback, useEffect, useState } from 'react'
import AvatarContainer from '../AvatarContainer'
import useDashboardInfo from '@/Hooks/useDashboardInfo'
import { INotification } from '@/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { format, } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
const TabNotificationContainer: FC = () => {
    const { recentNotifications } = useDashboardInfo();
    if (!recentNotifications) {
        return (
            <div className='w-full flex items-center'>
                <h4 className='text-2xl font-semibold tracking-wide'>No Data...</h4>
            </div>
        )
    }
    return (
        <ScrollArea className="w-full  h-[24rem]  border p-4 rounded-xl">
            <CardHeader className='pb-1 mb-2 pt-0 pl-2 border-b sticky top-0 x-10 bg-background'>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>
                    Agent Status
                </CardDescription>
            </CardHeader>
            <div className="space-y-8">
                {
                    recentNotifications.map(notitifcation => (
                        <NotificationItem key={notitifcation.id} notification={notitifcation} />
                    ))
                }
            </div>
        </ScrollArea>
    )
}

export default TabNotificationContainer



const NotificationItem: FC<{
    notification: INotification
}> = ({ notification }) => {


    const [fromNow, setFromNow] = useState(formatDistanceToNow(parseISO(notification.created_at)));
    useEffect(() => {
        const interval = setInterval(() => {
            setFromNow(formatDistanceToNow(parseISO(notification.created_at)))
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center">
            <div className="ml-4 space-y-1">
                <p className="text-xs font-medium leading-none">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                    {format(parseISO(notification.created_at), 'Pp')}
                </p>
            </div>
            <div className="ml-auto font-medium text-xs ">{`${fromNow} ago`}</div>
        </div>
    )
}