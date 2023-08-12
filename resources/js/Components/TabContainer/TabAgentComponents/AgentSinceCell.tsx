import { minsToDuration } from '@/Pages/Index';
import {  differenceInSeconds, format, formatDistanceToNow } from 'date-fns';
import React, { FC, useEffect, useMemo, useState } from 'react'

interface AgentSinceCellProps{
    timeStamp:Date;
    statusId:number;
}

const AgentSinceCell:FC<AgentSinceCellProps> = ({timeStamp,statusId}) => {
    
    const [diffInMins,setDiffInMins] = useState<number>(differenceInSeconds(new Date(),timeStamp)/60);
    
    const duration=useMemo(()=>minsToDuration(diffInMins),[diffInMins]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDiffInMins(differenceInSeconds(new Date(),timeStamp)/60);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeStamp]);

    return (
        <div className='flex flex-col'> 
            <span>{format(new Date(timeStamp),'Pp')}</span>
            <span>{formatDistanceToNow(new Date(timeStamp),)}</span>
            { (statusId===13||statusId===3||statusId===4||statusId===5) &&<span>{duration}</span>}
        </div>
    )
}

export default AgentSinceCell