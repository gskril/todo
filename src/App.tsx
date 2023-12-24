import './App.css'
import { useEffect, useState } from 'react'
import Auth from './screens/Auth'
import { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import Account from './screens/Account'

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

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {session && <p>Logged in as user {session.user.id}</p>}

      {!session ? (
        <Auth />
      ) : (
        <Account key={session.user.id} session={session} />
      )}
    </div>
  )
}
