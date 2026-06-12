import { create } from 'zustand';

export interface UpdateInfo {
  version: string;
  date?: string;
  body?: string;
}

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'downloading'
  | 'downloaded'
  | 'error'
  | 'upToDate';

interface UpdateState {
  status: UpdateStatus;
  updateInfo: UpdateInfo | null;
  downloadProgress: number;
  errorMessage: string | null;

  setChecking: () => void;
  setAvailable: (info: UpdateInfo) => void;
  setDownloading: (progress: number) => void;
  setDownloaded: () => void;
  setUpToDate: () => void;
  setError: (message: string) => void;
  reset: () => void;
}

export const useUpdateStore = create<UpdateState>((set) => ({
  status: 'idle',
  updateInfo: null,
  downloadProgress: 0,
  errorMessage: null,

  setChecking: () => set({ status: 'checking', errorMessage: null }),
  setAvailable: (info) => set({ status: 'available', updateInfo: info }),
  setDownloading: (progress) => set({ status: 'downloading', downloadProgress: progress }),
  setDownloaded: () => set({ status: 'downloaded', downloadProgress: 100 }),
  setUpToDate: () => set({ status: 'upToDate' }),
  setError: (message) => set({ status: 'error', errorMessage: message }),
  reset: () => set({ status: 'idle', updateInfo: null, downloadProgress: 0, errorMessage: null }),
}));
