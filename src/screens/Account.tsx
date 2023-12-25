import autoAnimate from '@formkit/auto-animate'
import { Session } from '@supabase/supabase-js'
import clsx from 'clsx'
import { CheckIcon, TrashIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/sonner'
import { useTodos } from '@/hooks/useTodos'

const taskFilters = ['none', 'task', 'content'] as const
type TaskFilters = (typeof taskFilters)[number]

export default function Account({ session }: { session: Session }) {
  const animationParent = useRef(null)
  const [title, setTitle] = useState('')
  const [trigger, setTrigger] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filter, setFilter] = useState<TaskFilters>('none')
  const [buttonUsed, setButtonUsed] = useState<'task' | 'content'>('task')

  const { data, create, complete, remove } = useTodos(session, trigger)

  useEffect(() => {
    animationParent.current && autoAnimate(animationParent.current)
  }, [animationParent])

  const filteredData = data?.filter((todo) => {
    if (filter === 'none') return false
    return todo.tag === filter
  })

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const { error } = await create({
      title,
      tag: buttonUsed,
      user_id: session.user.id,
    })

    if (error) {
      toast.error(error.message)
    } else {
      setTitle('')
      toast.success('Todo created')
      setTrigger(new Date().toISOString())
    }

    setIsSubmitting(false)
  }

  async function handleRemove(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const id = formData.get('id') as string
    const { error } = await remove(id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Todo deleted')
      setTrigger(new Date().toISOString())
    }

    setIsSubmitting(false)
  }

  async function handleComplete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const id = formData.get('id') as string
    const { error } = await complete(id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Todo completed')
      setTrigger(new Date().toISOString())
    }

    setIsSubmitting(false)
  }

  return (
    <div>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Todos</CardTitle>

        <div className="flex items-center gap-2">
          {taskFilters.map((f) => (
            <FilterBadge id={f} filter={filter} setFilter={setFilter} />
          ))}
        </div>
      </CardHeader>

      <CardContent
        ref={animationParent}
        className={clsx([
          'divide-y divide-gray-200',
          filter === 'none' && 'hidden',
        ])}
      >
        {filteredData && filteredData.length === 0 && (
          <div className="py-2 text-center text-gray-500">Nothing to do 💤</div>
        )}

        {filteredData?.map((todo) => (
          <div className="flex items-center space-x-2 py-2" key={todo.id}>
            <span className="flex-grow text-sm">{todo.title}</span>

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
            placeholder="Take out the trash"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex w-full gap-2">
            <Button
              className="w-full"
              type="submit"
              id="task-btn"
              disabled={isSubmitting}
              onClick={() => setButtonUsed('task')}
            >
              Save task
            </Button>

            <Button
              className="w-full"
              type="submit"
              disabled={isSubmitting}
              onClick={() => setButtonUsed('content')}
            >
              Save content
            </Button>
          </div>
        </CardFooter>
      </form>

      <Toaster />
    </div>
  )
}

// TODO: Convert this to a more semantic component like a radio group
function FilterBadge({
  id,
  filter,
  setFilter,
}: {
  id: TaskFilters
  filter: TaskFilters
  setFilter: (filter: TaskFilters) => void
}) {
  const variant = filter === id ? 'default' : 'outline'

  return (
    <Badge
      variant={variant}
      className="cursor-pointer capitalize"
      onClick={() => setFilter(id)}
    >
      {id === 'task' ? 'tasks' : id}
    </Badge>
  )
}
