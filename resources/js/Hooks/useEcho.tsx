
import {create} from 'zustand'

interface IEcho{
    Echo?:any;
    setEcho:(echo:any)=>void;
}

const useEcho = create<IEcho>(set=>({
    Echo:null,
    setEcho:(echo)=>set({Echo:echo}),
}));



export default useEcho