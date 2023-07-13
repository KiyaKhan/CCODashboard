import React, { FC } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { cn } from '@/Libs/Utils';
import { User } from '@/types';

interface AvatarContainerProps{
    className?:string;
    user:User;
}

const AvatarContainer:FC<AvatarContainerProps> = ({className,user}) => {
    return (
        <Avatar className={cn("mr-2 h-5 w-5",className)}>
            <AvatarImage
                src={`${route('index')}/placeholder/placeholder.jpg`}
                //src={`https://fakeperson-face.oss-us-west-1.aliyuncs.com/Face/female/female20171026066686462.jpg`}
                alt='Avatar'
            />
            <AvatarFallback>CC</AvatarFallback>
        </Avatar>
    )
}

export default AvatarContainer