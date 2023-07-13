import { User } from '@/types';
import React,{ReactNode, createContext, useEffect,useContext,useState} from 'react';

const LaravelEchoContext = createContext({});



export const useLaravelEcho = () =>{
    return useContext(LaravelEchoContext);
}



export const LaravelEchoProvider:React.FC<{children:ReactNode}> =({children})=>{
    
    const [onlineAgents,setOnlineAgents] = useState<User[]>([]);
    

    useEffect(()=>{
        window.Echo.join('global_channel')
        .here((users:User[])=>{
            setOnlineAgents(users);
        })
        .listen('AgentLogInEvent',(e:any)=>{
            console.log(e);
        });
        
        return ()=>window.Echo.leaveChannel('conversation_all');
    },[]);

    return (
        <LaravelEchoContext.Provider value={{ 
            onlineAgents,
        }}>
            {children}
        </LaravelEchoContext.Provider>
    )
}




