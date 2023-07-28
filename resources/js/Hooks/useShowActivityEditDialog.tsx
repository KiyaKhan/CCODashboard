
import {create} from 'zustand';

interface IEditActivityLog{
    ShowActivityEditDialog?:boolean;
    setShowActivityEditDialog:(show:boolean,agentLogIdToEdit?:string)=>void;
    agentLogIdToEdit?:string;
}

const useShowActivityEditDialog = create<IEditActivityLog>(set=>({
    agentLogIdToEdit:undefined,
    ShowActivityEditDialog:false,
    setShowActivityEditDialog:(show:boolean,agentLogIdToEdit?:string)=>set({ShowActivityEditDialog:show,agentLogIdToEdit}),
}));



export default useShowActivityEditDialog