import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/supabase'
import { CreateTodo, Todo } from '@/types'

export function useTodos(session: Session, trigger: string) {
  const [data, setData] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getTodos() {
      setIsLoading(true)

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('completed', false)
        .eq('user_id', session.user.id)

      if (error) {
        alert(error.message)
      } else if (data) {
        setData(data)
      }

      setIsLoading(false)
    }

    getTodos()
  }, [session, trigger])

  async function create(todo: CreateTodo) {
    return await supabase.from('todos').insert(todo)
  }

  async function remove(id: string) {
    const res = await supabase.from('todos').delete().match({ id })

    if (res.error) {
      toast({ description: res.error.message, variant: 'destructive' })
    } else {
      toast({ description: 'Todo deleted' })
    }

    return res
  }

  async function complete(id: string) {
    const res = await supabase
      .from('todos')
      .update({ completed: true })
      .match({ id })

    if (res.error) {
      toast({ description: res.error.message, variant: 'destructive' })
    } else {
      toast({ description: 'Todo completed' })
    }

    return res
  }

  return { data, create, complete, remove, isLoading }
}
