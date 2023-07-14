import { User } from '@/types';
import {create} from 'zustand'

interface IuseStoreModal{
    currentUser?:User;
    setCurrentUser:(user:User)=>void;
}

const useCurrentUser = create<IuseStoreModal>(set=>({
    currentUser:undefined,
    setCurrentUser:(user)=>set({currentUser:user}),
}));



export default useCurrentUser