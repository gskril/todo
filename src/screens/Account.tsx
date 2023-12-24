import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

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
    <form onSubmit={(e) => createTodo(e)} className="form-widget">
      <input name="title" type="text" placeholder="my task" />
      <div>
        <button
          className="button primary block"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
