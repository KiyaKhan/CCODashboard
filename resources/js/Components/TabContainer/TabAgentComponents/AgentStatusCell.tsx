import { cn } from '@/Libs/Utils';
import { minsToDuration } from '@/Pages/Index';
import { User } from '@/types'
import { differenceInSeconds } from 'date-fns';
import {FC, useEffect, useMemo, useState} from 'react'

const AgentStatusCell:FC<{user:User}> = ({user}) => {
    
    const dt=new Date(user.updated_at);
    const [diffInMins,setDiffInMins] = useState(differenceInSeconds(new Date(),dt)/60);
    const over:number=useMemo(()=>{
        let limit=15;
        if(user.status.id===5) limit=60;
        if(user.status.id===4) limit=5;
        if(user.status.id===3) limit=15;
        return diffInMins-limit
    },[diffInMins,user.status.id]);
    useEffect(() => {
        const interval = setInterval(() => {
            setDiffInMins(differenceInSeconds(new Date(),dt)/60);
        }, 1000);
        return () => clearInterval(interval);
    }, [dt]);
    return (
        <div className={cn('flex flex-col space-y-1.5 text-primary',
            (over>0&&user.status.id===5)&&'text-yellow-500 dark:text-yellow-400',
            (over>0&&(user.status.id===4||user.status.id===3))&&'text-red-500 dark:text-red-400',
            )}>
            <span>
                {`${user.status.name}`}
            </span>
            {
                (over>0)&&<span>{minsToDuration(over)}</span>
            }
        </div>
    )
}

export default AgentStatusCell