
import {create} from 'zustand'

interface INewAgentDialog{
    showNewAgentDialog?:boolean;
    setShowNewAgentDialog:(show:boolean)=>void;
}

const useNewAgentDialog = create<INewAgentDialog>(set=>({
    showNewAgentDialog:false,
    setShowNewAgentDialog:(show)=>set({showNewAgentDialog:show}),
}));



export default useNewAgentDialog