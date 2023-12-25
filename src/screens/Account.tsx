import { Session } from '@supabase/supabase-js'
import { CheckIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'

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
import { Toaster } from '@/components/ui/toaster'
import { useTodos } from '@/hooks/useTodos'

export default function Account({ session }: { session: Session }) {
  const [title, setTitle] = useState('')
  const [trigger, setTrigger] = useState('')
  const { data, create, complete, remove, isLoading } = useTodos(
    session,
    trigger
  )

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { error } = await create({ title, tag: '', user_id: session.user.id })

    if (error) {
      alert(error.message)
    } else {
      setTitle('')
      setTrigger(title)
    }
  }

  async function handleRemove(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const id = formData.get('id') as string
    const { error } = await remove(id)

    if (error) {
      alert(error.message)
    } else {
      setTrigger(id)
    }
  }

  async function handleComplete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const id = formData.get('id') as string
    const { error } = await complete(id)

    if (error) {
      alert(error.message)
    } else {
      setTrigger(id)
    }
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
        {data.map((todo) => (
          <div className="flex items-center space-x-2 py-2" key={todo.id}>
            <Label className="flex-grow" htmlFor="task-1">
              {todo.title}
            </Label>

            <form onSubmit={handleComplete}>
              <input type="hidden" name="id" value={todo.id} />
              <Button
                className="text-green-500"
                variant="outline"
                type="submit"
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
            </form>

            <form onSubmit={handleRemove}>
              <input type="hidden" name="id" value={todo.id} />
              <Button className="text-red-500" variant="outline" type="submit">
                <TrashIcon className="h-4 w-4" />
              </Button>
            </form>
          </div>
        ))}
      </CardContent>

      <form onSubmit={handleCreate}>
        <CardFooter className="flex-col gap-2">
          <Input
            name="title"
            placeholder="Add a new task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Loading ...' : 'Add task'}
          </Button>
        </CardFooter>
      </form>

      <Toaster />
    </div>
  )
}
