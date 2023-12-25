import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { supabase } from '@/supabase'
import { CreateTodo, Todo } from '@/types'

export function useTodos(session: Session, trigger: string) {
  const [data, setData] = useState<Todo[] | undefined>(undefined)

  useEffect(() => {
    async function getTodos() {
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
    }

    getTodos()
  }, [session, trigger])

  async function create(todo: CreateTodo) {
    return await supabase.from('todos').insert(todo)
  }

  async function remove(id: string) {
    return await supabase.from('todos').delete().match({ id })
  }

  async function complete(id: string) {
    return await supabase
      .from('todos')
      .update({ completed: true })
      .match({ id })
  }

  return { data, create, complete, remove }
}
