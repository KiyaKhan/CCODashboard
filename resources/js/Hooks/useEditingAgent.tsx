import { create } from "zustand";

interface IEditingAgent{
    userId:number|null;
    setAgentToEdit:(id:number)=>void;
}

const useEditingAgent = create<IEditingAgent>(set=>({
    userId:null,
    setAgentToEdit:(id:number)=>set({userId:id}),
}));
