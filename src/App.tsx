import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import './App.css'
import { supabase } from './supabase'
import Account from './screens/Account'
import Auth from './screens/Auth'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (session) {
    return <Account key={session.user.id} session={session} />
  } else {
    return <Auth />
  }
}
