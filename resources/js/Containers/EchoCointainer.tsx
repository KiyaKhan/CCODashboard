import useCurrentUser from '@/Hooks/useCurrentUser';
import useEcho from '@/Hooks/useEcho';
import { INotification, User } from '@/types';
import { FC, useEffect } from 'react'
import { toast } from 'react-toastify';

type EchoEvent ={
    notification:INotification;
    user:User;
}

const EchoCointainer:FC = () => {
    const {currentUser} = useCurrentUser();
    const {setEcho} = useEcho();
    useEffect(()=>{
        if(!currentUser)return;
        const echo=window.Echo.join('global_channel')
        .listen('AgentLogInEvent',(e:EchoEvent)=>{
            toast.info(e.notification.message);
            console.log(e);
        })
        .listen('AgentChangeStatusEvent',(e:EchoEvent)=>{
            toast.info(e.notification.message);
            console.log(e);
        })
        .listen('AgentLogOutEvent',(e:EchoEvent)=>{
            toast.info(e.notification.message);
            console.log(e);
        })
        .listen('AgentRegisteredEvent',(e:EchoEvent)=>{
            toast.info(e.notification.message);
            console.log(e);
        }); 
        setEcho(echo);
        return ()=>window.Echo.leaveChannel('conversation_all');
    },[currentUser]);
    return (
        <></>
    )
}

export default EchoCointainer