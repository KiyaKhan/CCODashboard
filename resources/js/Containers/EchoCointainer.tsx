import useCurrentUser from '@/Hooks/useCurrentUser';
import { FC, useEffect } from 'react'

const EchoCointainer:FC = () => {
    const {currentUser} = useCurrentUser();
    useEffect(()=>{
        if(!currentUser)return;
        const echo=window.Echo.join('global_channel')
        .listen('AgentLogInEvent',(e:any)=>{
            console.log(e);
        })
        .listen('AgentChangeStatusEvent',(e:any)=>{
            console.log(e);
        })
        .listen('AgentLogOutEvent',(e:any)=>{
            console.log(e);
        })
        .listen('AgentRegisteredEvent',(e:any)=>{
            console.log(e);
        })
        console.log(echo);
        return ()=>window.Echo.leaveChannel('conversation_all');
    },[currentUser]);
    return (
        <></>
    )
}

export default EchoCointainer