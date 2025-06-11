import { ITeam, User } from '@/types';
import { create } from 'zustand'

interface ISelectedTeam {
    loadingTeam?: boolean;
    selectedTeam?: ITeam;
    selectTeam: (team: ITeam) => void;
    setLoadingTeam: (loading: boolean) => void;
}

const useSelectedTeam = create<ISelectedTeam>(set => ({
    selectedTeam: undefined,
    selectTeam: (team) => set({ selectedTeam: team }),
    setLoadingTeam: (loading) => set({ loadingTeam: loading }),
}));
export default useSelectedTeam