import { Session } from '@supabase/supabase-js'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { useEffect, useState } from 'react'

import { supabase } from '@/supabase'
import { CreateTodo, Todo } from '@/types'

export function useTodos(session: Session, trigger: string) {
  const auth = { token: session.provider_token as string }
  const [todos, setTodos] = useState<Todo[] | undefined>(undefined)
  const [sheetId, setSheetId] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function getTodos() {
      if (!sheetId) return

      const doc = new GoogleSpreadsheet(sheetId, auth)
      await doc.loadInfo()

      const sheet = doc.sheetsByIndex[0]
      await sheet.loadHeaderRow()
      const _rows = await sheet.getRows<Todo>()

      const rows = _rows.map((row) => {
        const rowNumber = row.rowNumber
        const name = row.get('name')
        const type = row.get('type')
        const completed = row.get('completed')
        const created = row.get('created')

        return { rowNumber, name, type, completed, created }
      })

      // Remove completed todos
      const filteredRows = rows.filter((row) => row.completed === 'FALSE')

      setTodos(filteredRows)
    }

    getTodos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetId, trigger])

  useEffect(() => {
    async function getSheet() {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)

      if (error) {
        alert(error.message)
      } else if (data) {
        setSheetId(data[0]?.sheet_id || undefined)
      }
    }

    getSheet()
  }, [session])

  async function create(todo: CreateTodo) {
    if (!sheetId) return

    const doc = new GoogleSpreadsheet(sheetId, auth)
    await doc.loadInfo()

    const sheet = doc.sheetsByIndex[0]
    const res = await sheet.addRow(todo)
    return res
  }

  async function remove(todo: Todo | undefined) {
    if (!sheetId || !todo) return

    const doc = new GoogleSpreadsheet(sheetId, auth)
    await doc.loadInfo()

    const sheet = doc.sheetsByIndex[0]
    const rows = await sheet.getRows<Todo>()
    const relevantRow = rows.find((row) => row.rowNumber === todo.rowNumber)
    const res = await relevantRow?.delete()

    return res
  }

  async function complete(todo: Todo | undefined) {
    if (!sheetId || !todo) return

    const doc = new GoogleSpreadsheet(sheetId, auth)
    await doc.loadInfo()

    const sheet = doc.sheetsByIndex[0]
    const rows = await sheet.getRows<Todo>()
    const relevantRow = rows.find((row) => row.rowNumber === todo.rowNumber)

    if (!relevantRow) return

    relevantRow.set('completed', 'TRUE')
    await relevantRow.save()
  }

  async function setSheetIdForUser(id: string) {
    const res = await supabase
      .from('users')
      .insert({ id: session.user.id, sheet_id: id })

    if (!res.error) {
      setSheetId(id)
    }

    return res
  }

  return { todos, sheetId, setSheetIdForUser, create, complete, remove }
}
