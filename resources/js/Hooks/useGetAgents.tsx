
import { User } from '@/types';
import axios from 'axios';
import { toast } from 'react-toastify';
import {create} from 'zustand'


interface GetAgents{
    isAgentsTabOpen:boolean;
    previousFilters:string;
    previousStatusId:string;
    agents?:User[];
    setAgentsTabOpen:(open:boolean)=>void;
    getAgents: (teamId:number,filters:string,statusId:string)=> Promise<void> 
}

const useGetAgents = create<GetAgents>(set=>({
    agents:undefined,
    previousFilters:"",
    previousStatusId:"",
    isAgentsTabOpen:false,
    setAgentsTabOpen:(open:boolean)=>set({
        isAgentsTabOpen:open
    }),
    getAgents: async (teamId:number,filters:string,statusId:string)=>{
        
        
        set({
            previousFilters:statusId||"",
            previousStatusId:filters||""
        });
        try {
            const {data} = await axios.get(route('agents.index',{
                team_id:teamId,
                filter:filters,
                status_id:statusId
            }));
            set({ agents:data});
        } catch (error) {
            toast.error('Something went wrong. Please refresh the page and try again.')
        }
    },
    
}));



export default useGetAgents