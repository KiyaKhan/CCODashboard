
import {create} from 'zustand'

interface INewAdminDialog{
    showNewAdminDialog?:boolean;
    setShowNewAdminDialog:(show:boolean)=>void;
}

const useNewAdminDialog = create<INewAdminDialog>(set=>({
    showNewAdminDialog:false,
    setShowNewAdminDialog:(show)=>set({showNewAdminDialog:show}),
}));



export default useNewAdminDialog