import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: any;
  isPremium: boolean;
  // ... other properties
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isPremium: false,
  // ... other default values
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check user's subscription status when they log in
    const checkSubscriptionStatus = async (userId: string) => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_plan')
        .eq('id', userId)
        .single();

      if (!error && profile) {
        setIsPremium(
          profile.subscription_status === 'active' && 
          profile.subscription_plan === 'premium'
        );
      }
    };

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        checkSubscriptionStatus(session.user.id);
      } else {
        setUser(null);
        setIsPremium(false);
      }
    });
  }, []);

  const value = {
    user,
    isPremium,
    // ... other values
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


