import useCurrentUser from '@/Hooks/useCurrentUser';
import useEcho from '@/Hooks/useEcho';
import { FC, useEffect } from 'react'

const EchoCointainer:FC = () => {
    const {currentUser} = useCurrentUser();
    const {setEcho} = useEcho();
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
        }); 
        setEcho(echo);
        return ()=>window.Echo.leaveChannel('conversation_all');
    },[currentUser]);
    return (
        <></>
    )
}

export default EchoCointainer