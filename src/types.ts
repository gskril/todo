// import { Database } from './database.types'

// export type Todo = Database['public']['Tables']['todos']['Row']
// export type CreateTodo = Database['public']['Tables']['todos']['Insert']

export type Todo = {
  rowNumber: number
  name: string
  type: 'task' | 'content'
  completed: 'TRUE' | 'FALSE'
  created: string
}

export type CreateTodo = Omit<Todo, 'rowNumber'>
