
import {create} from 'zustand';

interface INewActivityLog{
    showActivityAddDialog?:boolean;
    setShowActivityAddDialog:(show:boolean,agentSessionId?:string)=>void;
    agentSessionId?:string;
}

const useShowActivityAddDialog = create<INewActivityLog>(set=>({
    agentSessionId:undefined,
    showActivityAddDialog:false,
    setShowActivityAddDialog:(show:boolean,agentSessionId?:string)=>set({showActivityAddDialog:show,agentSessionId}),
}));



export default useShowActivityAddDialog