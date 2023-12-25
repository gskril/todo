import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

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

  return { data, create, isLoading }
}
