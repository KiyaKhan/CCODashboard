import { ITeam, User } from '@/types';
import { DateRange } from 'react-day-picker';
import { create } from 'zustand'

interface ILogFilter {
    date: DateRange | undefined;
    users: User[];
    driver_id: number | undefined;

    selectDate: (date: DateRange | undefined) => void;
    selectDriver: (driver_id: number | undefined) => void;
    insertUser: (user: User | null) => void;
    removeUser: (user: User | null) => void;
    setUsers: (users: User[]) => void;
}

const useAgentLogFilter = create<ILogFilter>(set => ({
    date: undefined,
    users: [],
    driver_id: undefined,
    selectDate: (date: DateRange | undefined) => set({ date }),
    selectDriver: (driver_id: number | undefined) => set({ driver_id }),
    insertUser: (user: User | null) => set(state => {
        const existed = state.users.find(agent => agent.id === user?.id);
        if (user && !existed) {
            return ({ users: [user, ...state.users] });
        }
        return state;
    }),
    removeUser: (user: User | null) => set(state => {
        const result = state.users.filter(agent => agent.id != user?.id ?? 0);
        return ({ users: result });
    }),
    setUsers: (users: User[]) => set({ users })
}));
export default useAgentLogFilter