import { Database } from './database.types'

export type Todo = Database['public']['Tables']['todos']['Row']
export type CreateTodo = Database['public']['Tables']['todos']['Insert']
