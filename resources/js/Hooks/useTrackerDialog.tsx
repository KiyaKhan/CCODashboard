
import {create} from 'zustand';

type Status = 'SpecialProject'|'Undertime'|'Overtime';

interface Store{
    isOpen?:boolean;
    onClose:()=>void;
    type?:Status;
    onOpen:(type: Status)=>void;
}
    


export const useTrackerDialog = create<Store>(set=>({
    onOpen:(type)=>set({isOpen:true,type}),
    onClose:()=>set({isOpen:false,type:undefined})
}));