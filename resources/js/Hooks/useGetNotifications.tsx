
import { INotification } from '@/types';
import axios from 'axios';
import { toast } from 'react-toastify';
import {create} from 'zustand'


interface GetNotifications{
    isNotificationsTabOpen:boolean;
    notifications?:INotification[];
    setNotificationsTabOpen:(open:boolean)=>void;
    getNotifications: (teamId:number,date?:Date)=> Promise<void> 
}

const useGetNotifications = create<GetNotifications>(set=>({
    notifications:undefined,
    isNotificationsTabOpen:false,
    setNotificationsTabOpen:(open:boolean)=>set({
        isNotificationsTabOpen:open
    }),
    getNotifications: async (teamId:number,date?:Date)=>{
        if(!teamId)return undefined;
        try {
            const {data} = await axios.get(route('notifications',{
                team_id:teamId,
                date:date||new Date
            }));
            
            set({ notifications:data});
        } catch (error) {
            toast.error('Something went wrong. Please refresh the page and try again.')
        }
    },
    
}));



export default useGetNotifications