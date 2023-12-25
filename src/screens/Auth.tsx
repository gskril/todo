import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { supabase } from '../supabase'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      if (error.message === 'User already registered') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          alert(signInError.message)
        } else {
          alert('Check your email for the login link!')
        }
      } else {
        alert(error.message)
      }
    } else {
      alert('Check your email for the login link!')
    }

    setLoading(false)
  }

  return (
    <div>
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
        <CardDescription>Sign in to manage your tasks.</CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="flex flex-col gap-2">
          <Input
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            className="inputField"
            type="password"
            placeholder="Your password"
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className={'button block'} disabled={loading}>
            {loading ? <span>Loading</span> : <span>Register</span>}
          </Button>
        </CardContent>
      </form>
    </div>
  )
}
