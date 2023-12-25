import { Session } from '@supabase/supabase-js'
import { CheckIcon, TrashIcon } from 'lucide-react'
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
import { Label } from '@/components/ui/label'

import { supabase } from '../supabase'
import { Todo } from '../types'

export default function Account({ session }: { session: Session }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')

  // use this as a trigger to refresh the todos (there's probs a better way)
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    async function getTodos() {
      setLoading(true)

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', session.user.id)

      if (error) {
        alert(error.message)
      } else if (data) {
        setTodos(data)
      }

      setLoading(false)
    }

    getTodos()
  }, [session, newTodo])

  async function createTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    const { user } = session

    if (!title || !user.id) {
      alert('You must add a title')
      return
    }

    const { error } = await supabase.from('todos').upsert({
      user_id: user.id,
      title: title,
      tag: 'work',
      updated_at: new Date().toISOString(),
    })

    if (error) {
      alert(error.message)
    } else {
      setTitle('')
      setNewTodo(title)
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

      <CardContent className="divide-y divide-gray-200">
        {todos.map((todo) => (
          <div className="flex items-center space-x-2 py-2">
            <Label className="flex-grow" htmlFor="task-1">
              {todo.title}
            </Label>

            <Button className="text-green-500" variant="outline">
              <CheckIcon className="h-4 w-4" />
            </Button>

            <Button className="text-red-500" variant="outline">
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>

      <form onSubmit={(e) => createTodo(e)}>
        <CardFooter className="flex-col">
          <Input
            className="mb-2 w-full"
            name="title"
            placeholder="Add a new task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Loading ...' : 'Add task'}
          </Button>
        </CardFooter>
      </form>
    </div>
  )
}
