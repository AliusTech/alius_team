import { create } from 'zustand';
import { getSession, saveSession, clearSession as dbClearSession, updateAccessToken as dbUpdateAccessToken } from '@/data/db/commands';
import type { Session, User } from '@/features/auth/types';

/** Authentication session state — stores access token, user info, and login status. */
export interface SessionState {
  session: Session | null;
  isAuthenticated: boolean;
  user: User | null;
  isLoaded: boolean;

  // Actions
  loadSession: () => Promise<void>;
  setSession: (session: Session) => Promise<void>;
  clearSession: () => Promise<void>;
  updateAccessToken: (accessToken: string, expiresIn: number) => Promise<void>;
}

/** Zustand store hook for managing the current auth session (backed by local DB). */
export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  isAuthenticated: false,
  user: null,
  isLoaded: false,

  loadSession: async () => {
    try {
      const session = await getSession();
      set({
        session,
        isAuthenticated: !!session,
        user: session?.user ?? null,
        isLoaded: true,
      });
    } catch (error) {
      console.error('Failed to load session from database:', error);
      set({
        session: null,
        isAuthenticated: false,
        user: null,
        isLoaded: true,
      });
    }
  },

  setSession: async (session) => {
    try {
      await saveSession(session);
      set({
        session,
        isAuthenticated: true,
        user: session.user,
      });
    } catch (error) {
      console.error('Failed to save session to database:', error);
      throw error;
    }
  },

  clearSession: async () => {
    try {
      await dbClearSession();
      set({
        session: null,
        isAuthenticated: false,
        user: null,
      });
    } catch (error) {
      console.error('Failed to clear session from database:', error);
      throw error;
    }
  },

  updateAccessToken: async (accessToken, expiresIn) => {
    const { session } = get();
    if (!session) return;

    const expiresAt = Date.now() + expiresIn * 1000;
    const updated = {
      ...session,
      accessToken,
      expiresAt,
    };

    try {
      await dbUpdateAccessToken(accessToken, expiresAt);
      set({ session: updated });
    } catch (error) {
      console.error('Failed to update access token in database:', error);
      throw error;
    }
  },
}));