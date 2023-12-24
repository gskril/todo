import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { supabase } from '../supabase'
import { Todo } from '../types'

export default function Account({ session }: { session: Session }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getTodos() {
      setLoading(true)
      const { user } = session

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        alert(error.message)
      } else if (data) {
        setTodos(data)
      }

      setLoading(false)
    }

    getTodos()
  }, [session])

  async function createTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // get 'title' from the input
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') as string | null
    console.log(title)

    setLoading(true)
    const { user } = session

    if (!title || !user.id) {
      alert('You must add a title')
      return
    }

    const { data, error } = await supabase.from('todos').upsert({
      user_id: user.id,
      title: title,
      tag: 'work',
      updated_at: new Date().toISOString(),
    })

    if (error) {
      alert(error.message)
    }

    setLoading(false)
  }

  return (
    <div>
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
        <CardDescription>
          Check off your tasks as you complete them.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p>existing todos go here</p>
      </CardContent>

      <form onSubmit={(e) => createTodo(e)}>
        <CardFooter className="flex-col">
          <Input
            className="mb-2 w-full"
            name="title"
            placeholder="Add a new task"
          />
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Loading ...' : 'Add task'}
          </Button>
        </CardFooter>
      </form>
    </div>
  )
}
