
import {create} from 'zustand';

interface INewTeamDialog{
    ShowActivityEditDialog?:boolean;
    setShowActivityEditDialog:(show:boolean)=>void;
}

const useShowActivityEditDialog = create<INewTeamDialog>(set=>({
    ShowActivityEditDialog:false,
    setShowActivityEditDialog:(show)=>set({ShowActivityEditDialog:show}),
}));



export default useShowActivityEditDialog