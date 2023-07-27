
import {create} from 'zustand';

interface INewTeamDialog{
    ShowActivityEditDialog?:boolean;
    setShowActivityEditDialog:(show:boolean,agentLogIdToEdit?:string)=>void;
    agentLogIdToEdit?:string;
}

const useShowActivityEditDialog = create<INewTeamDialog>(set=>({
    agentLogIdToEdit:undefined,
    ShowActivityEditDialog:false,
    setShowActivityEditDialog:(show:boolean,agentLogIdToEdit?:string)=>set({ShowActivityEditDialog:show,agentLogIdToEdit}),
}));



export default useShowActivityEditDialog