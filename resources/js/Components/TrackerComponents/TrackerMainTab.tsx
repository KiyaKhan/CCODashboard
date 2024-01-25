import { PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import {  formatInTimeZone } from 'date-fns-tz';
import React, { FC, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import { BiLoaderCircle } from 'react-icons/bi';
import { minsToDuration } from '@/Pages/Index';
import { useTrackerDialog } from '@/Hooks/useTrackerDialog';

interface Props{
    elapsed:number;
    totalTime:number;
}

const TrackerMainTab:FC<Props> = ({elapsed,totalTime}) => {
    const {onOpen} = useTrackerDialog();
    const [dt,setDt] = useState(new Date());
    const {user} = usePage<PageProps>().props.auth;
    const [loadingId,setLoadingId] = useState(0);
    const {statuses} = usePage<PageProps>().props;
    useEffect(() => {
        const timer = setInterval(() => {
            setDt(new Date());
        }, 1000);
        return () => clearInterval(timer);
    },[]);

    const statusWithouthOffline = statuses.filter(status=>status.id!==10);
    const onStatusChange = (status_id:number) =>{

        if(status_id===12) return onOpen('SpecialProject');

        router.post(route('tracker.update'),{status_id},{
            preserveState:false,
            onStart:()=>setLoadingId(status_id),
            onFinish:()=>setLoadingId(0),
            onError:()=>toast.error('Something went wrong! Please try again'),
        });
    }

    const onLogOut = () =>{
        //toast.info(totalTime.toString());
        /*
            if elapsed is under 8 hours, show modal with type 'Undertime'
            if elapsed is over 9 hours, show modal with type 'Overtime'
            else, log out
        */
        if(totalTime<480) return onOpen('Undertime');
        if(totalTime>520) return onOpen('Overtime');
        router.post(route('tracker.logout'),{
            early_departure_reason:'',
            overtime_reason:''
        },{
            onStart:()=>setLoadingId(10),
            onFinish:()=>setLoadingId(10),
        });
    }

    return (
        <div className='flex flex-col space-y-1.5 relative'>
            <div className='flex gap-x-2.5 items-center'>
                <div className='w-56 bg-secondary rounded py-5 font-bold text-3xl text-center'>
                    { elapsed ? minsToDuration(elapsed) : '00:00:00' }
                </div>
                <div className='flex-1 font-semibold text-xl text-right'>
                    <p>
                        {`${user.first_name} ${user.last_name}`}
                    </p>
                    <p>
                        {formatInTimeZone(dt, 'America/New_York','yyyy-MM-dd HH:mm:ss zzz')}
                    </p>
                </div>
                <Button onClick={onLogOut} disabled={!!loadingId} className='text-xl font-bold aspect-square h-20'>
                    {loadingId===10 && <BiLoaderCircle className='h-5 w-5 mr-2 animate-spin' />}
                    End Shift
                </Button>
            </div>
            <div className='grid grid-cols-6 gap-1.5'>
                {
                    statusWithouthOffline.map(status=> <Button variant='secondary' key={status.id} onClick={()=>onStatusChange(status.id)} disabled={user.status_id===status.id || !!loadingId} className='font-semibold' size='sm'> {loadingId===status.id && <BiLoaderCircle className='h-4 w-4 mr-2 animate-spin' />} {status.name}</Button>)
                }
            </div>
        </div>
    )
}

export default TrackerMainTab;

