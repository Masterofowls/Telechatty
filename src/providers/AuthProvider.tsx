import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { LoadingScreen } from '@/components/LoadingScreen';
import { hasSupabaseConfig } from '@/lib/env';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) {
    console.warn('Failed to fetch profile', error.message);
    return null;
  }

  return data as Profile;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(() => hasSupabaseConfig());

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) {
        return;
      }

      setSession(data.session);

      if (data.session?.user) {
        setProfile(await loadProfile(data.session.user.id));
      }

      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (!nextSession?.user) {
        setProfile(null);
        return;
      }

      void loadProfile(nextSession.user.id).then((nextProfile) => {
        if (mounted) {
          setProfile(nextProfile);
        }
      });
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) {
      return;
    }

    setProfile(await loadProfile(userId));
  }, [session]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      refreshProfile,
      signOut,
    }),
    [session, profile, loading, refreshProfile, signOut],
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
