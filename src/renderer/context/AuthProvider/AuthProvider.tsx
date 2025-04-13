/*
import { createContext, useContext, useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLocation } from 'react-router'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { location } = useLocation();
  const navigate = useNavigate();

  // Check if Supabase credentials are available
  const hasSupabaseCredentials = 
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' &&
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'string'

  useEffect(() => {
    if (!hasSupabaseCredentials) {
      setError('Supabase credentials are not configured. Please connect to Supabase first.')
      setLoading(false)
      return
    }


    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (event === 'SIGNED_IN') {
        navigate('/dashboard')
      }
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [hasSupabaseCredentials]);

  const signIn = async (email: string, password: string) => {
    if (!hasSupabaseCredentials) {
      throw new Error('Authentication is not configured')
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!hasSupabaseCredentials) {
      throw new Error('Authentication is not configured')
    }
  
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    if (signUpError) throw signUpError
  }

  const signOut = async () => {
    if (!hasSupabaseCredentials) {
      throw new Error('Authentication is not configured')
    }
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
*/