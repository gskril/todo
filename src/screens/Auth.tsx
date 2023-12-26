import { Info } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { supabase } from '../supabase'

const isLocalDb = import.meta.env.VITE_SUPABASE_URL?.includes('localhost')

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      if (error.message === 'User already registered') {
        // If the user already exists, try to sign them in instead
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          alert(signInError.message)
        }
      } else {
        alert(error.message)
      }
    }

    setLoading(false)
  }

  const handleGoogleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
      },
    })

    if (error) {
      alert(error.message)
    }

    setLoading(false)
  }

  return (
    <div>
      <CardHeader>
        <CardTitle>Todo</CardTitle>
        <CardDescription>Sign in to manage your tasks.</CardDescription>
      </CardHeader>

      {(() => {
        if (isLocalDb) {
          // Google auth doesn't work with local Supabase, so we'll use email auth instead
          return (
            <form onSubmit={handleEmailLogin}>
              <CardContent className="flex flex-col gap-2">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>
                    Local Supabase has limited auth providers so you're seeing a
                    fallback.
                  </AlertDescription>
                </Alert>

                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  required={true}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  required={true}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button disabled={loading}>
                  {loading ? <span>Loading</span> : <span>Register</span>}
                </Button>
              </CardContent>
            </form>
          )
        }

        return (
          <form onSubmit={handleGoogleLogin}>
            <CardContent className="flex flex-col">
              <Button disabled={loading} type="submit">
                Sign in with Google
              </Button>
            </CardContent>
          </form>
        )
      })()}
    </div>
  )
}
