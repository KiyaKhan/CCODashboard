
import { LogsBySessionId } from '@/Components/TabContainer/TabActivityLogs';
import {create} from 'zustand'

interface IActivityLogs{
    logs?:LogsBySessionId[];
    setLogs:(logs:LogsBySessionId[])=>void;
}

const useActivityLogs = create<IActivityLogs>(set=>({
    logs:undefined,
    setLogs:(logs:LogsBySessionId[])=>set({logs}),
}));



export default useActivityLogs