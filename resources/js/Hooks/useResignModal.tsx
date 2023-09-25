
import {create} from 'zustand';



interface ResignModal{
    isOpen?:boolean;
    userId?:string;
    onOpen:(userId:string)=>void;
    onClose:()=>void;
}
    


export const useResignModal = create<ResignModal>(set=>({
    userId:undefined,
    onOpen:(userId)=>set({isOpen:true,userId}),
    onClose:()=>set({isOpen:false,userId:undefined})
}));