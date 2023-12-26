import autoAnimate from '@formkit/auto-animate'
import { Session } from '@supabase/supabase-js'
import clsx from 'clsx'
import { CheckIcon, TrashIcon } from 'lucide-react'
import { AlertCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSheets } from '@/hooks/useSheets'
import { useTodos } from '@/hooks/useTodos'

const taskFilters = ['none', 'task', 'content'] as const
type TaskFilters = (typeof taskFilters)[number]

export default function Account({ session }: { session: Session }) {
  const animationParent = useRef(null)
  const [title, setTitle] = useState('')
  const [trigger, setTrigger] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filter, setFilter] = useState<TaskFilters>('none')
  const [buttonUsed, setButtonUsed] = useState<'task' | 'content'>('task')

  const { todos, sheetId, setSheetIdForUser, create, complete, remove } =
    useTodos(session, trigger)

  const { validate, create: createNewSheet } = useSheets(session)

  useEffect(() => {
    animationParent.current && autoAnimate(animationParent.current)
  }, [animationParent])

  const filteredData = todos?.filter((todo) => {
    if (filter === 'none') return false
    return todo.type === filter
  })

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await create({
        name: title,
        type: buttonUsed,
        completed: 'FALSE',
        created: new Date().toISOString(),
      })

      setTitle('')
      toast.success('Todo created')
      setTrigger(new Date().toISOString())
    } catch (_err) {
      const err = _err as Error
      toast.error(err.message)
    }

    setIsSubmitting(false)
  }

  async function handleRemove(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const created = formData.get('created') as string

    try {
      await remove(todos?.find((t) => t.created === created))
      toast.success('Todo deleted')
      setTrigger(new Date().toISOString())
    } catch (_err) {
      const err = _err as Error
      toast.error(err.message)
    }

    setIsSubmitting(false)
  }

  async function handleComplete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string

    try {
      await complete(todos?.find((t) => t.name === name))
      toast.success('Todo completed')
      setTrigger(new Date().toISOString())
    } catch (_err) {
      const err = _err as Error
      toast.error(err.message)
    }

    setIsSubmitting(false)
  }

  async function handleValidate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const id = formData.get('id') as string
    const res = await validate(id)

    if (res.error) {
      setError(res.error.message || 'Something went wrong')
    } else {
      setError(null)
      await setSheetIdForUser(id)
    }
  }

  async function handleCreateSheet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const res = await createNewSheet('Todo')

    if (res.error) {
      setError(res.error.message || 'Something went wrong')
    } else {
      setError(null)
      await setSheetIdForUser(res.data)
      const url = `https://docs.google.com/spreadsheets/d/${res.data}`

      toast.success('Sheet created', {
        action: {
          label: 'Open',
          onClick: () => window.open(url, '_blank'),
        },
      })
    }
  }

  if (!sheetId) {
    return (
      <>
        <CardHeader>
          <CardTitle>Configure Google Sheet</CardTitle>
          <CardDescription>
            Your data will be stored in a private Google Sheet of your choice.
            Either connect an existing sheet or create a new one below.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <div className="hidden">
            <form id="creation-form" onSubmit={handleCreateSheet} />
            <form id="validation-form" onSubmit={handleValidate} />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Input
            required
            name="id"
            form="validation-form"
            placeholder="Sheet ID"
          />

          <div className="grid grid-cols-2 gap-2">
            <Button form="validation-form" type="submit" variant="outline">
              Connect Sheet
            </Button>

            <Button form="creation-form" type="submit">
              Create Sheet
            </Button>
          </div>
        </CardContent>
      </>
    )
  }

  return (
    <div>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Todos</CardTitle>

        <div className="flex items-center gap-2">
          {taskFilters.map((f) => (
            <FilterBadge id={f} filter={filter} setFilter={setFilter} key={f} />
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
          <div className="flex items-center space-x-2 py-2" key={todo.created}>
            <span className="flex-grow text-sm">{todo.name}</span>

            <form onSubmit={handleComplete}>
              <input type="hidden" name="name" value={todo.name} />

              <Button
                className="text-green-500"
                variant="outline"
                type="submit"
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
            </form>

            <form onSubmit={handleRemove}>
              <input type="hidden" name="created" value={todo.created} />

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
            required
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
