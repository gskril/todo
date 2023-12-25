import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import Account from './screens/Account'
import Auth from './screens/Auth'
import { supabase } from './supabase'

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
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-2 bg-slate-50 p-4">
      <Card className="mx-auto w-full max-w-96">
        {session ? (
          <Account key={session.user.id} session={session} />
        ) : (
          <Auth />
        )}
      </Card>

      {session && (
        <Button
          size="sm"
          variant="ghost"
          className="text-slate-500"
          onClick={async () => await supabase.auth.signOut()}
        >
          Sign out
        </Button>
      )}
    </div>
  )
}
