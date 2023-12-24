import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { supabase } from './supabase'
import Account from './screens/Account'
import Auth from './screens/Auth'
import { Layout } from './components/Layout'

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
    <Layout>
      {session ? <Account key={session.user.id} session={session} /> : <Auth />}
    </Layout>
  )
}
