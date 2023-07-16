
import {create} from 'zustand'

interface INewTeamDialog{
    showNewTeamDialog?:boolean;
    setShowNewTeamDialog:(show:boolean)=>void;
}

const useNewTeamDialog = create<INewTeamDialog>(set=>({
    showNewTeamDialog:false,
    setShowNewTeamDialog:(show)=>set({showNewTeamDialog:show}),
}));



export default useNewTeamDialog