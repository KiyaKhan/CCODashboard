import { ITeam, User } from '@/types';
import {create} from 'zustand'

interface ISelectedTeam{
    selectedTeam?:ITeam;
    selectTeam:(team:ITeam)=>void;
}

const useSelectedTeam = create<ISelectedTeam>(set=>({
    selectedTeam:undefined,
    selectTeam:(team)=>set({selectedTeam:team}),
}));



export default useSelectedTeam