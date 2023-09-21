
import { User } from '@/types';
import {create} from 'zustand'

interface IEditAgentDialog{
    showEditAgentDialog?:boolean;
    setShowEditAgentDialog:(show:boolean,agent?:User)=>void;
    agent?:User
}

const useEditAgentDialog = create<IEditAgentDialog>(set=>({
    agent:undefined,
    showEditAgentDialog:false,
    setShowEditAgentDialog:(show,agent)=>set({showEditAgentDialog:show,agent}),
}));



export default useEditAgentDialog