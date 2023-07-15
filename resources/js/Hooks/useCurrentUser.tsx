import { User } from '@/types';
import {create} from 'zustand'

interface ICurrentUser{
    currentUser?:User;
    setCurrentUser:(user:User|undefined)=>void;
}

const useCurrentUser = create<ICurrentUser>(set=>({
    currentUser:undefined,
    setCurrentUser:(user)=>set({currentUser:user}),
}));



export default useCurrentUser