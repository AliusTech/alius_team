import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TeamState {
  teamName: string;
  adminName: string;
  setTeamName: (name: string) => void;
  setAdminName: (name: string) => void;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      teamName: '',
      adminName: '',
      setTeamName: (teamName) => set({ teamName }),
      setAdminName: (adminName) => set({ adminName }),
    }),
    {
      name: 'alius-team-storage',
      partialize: (state) => ({ teamName: state.teamName, adminName: state.adminName }),
    }
  )
);
