import { Session } from '@supabase/supabase-js'
import { GoogleSpreadsheet } from 'google-spreadsheet'

const requiredHeaders = ['name', 'type', 'completed', 'created']

export function useSheets(session: Session) {
  const auth = { token: session.provider_token as string }

  async function validate(sheetId: string) {
    try {
      const doc = new GoogleSpreadsheet(sheetId, auth)
      await doc.loadInfo()
      const sheet = doc.sheetsByIndex[0]
      await sheet.loadHeaderRow()
      const rows = sheet.headerValues

      const hasAllHeaders = requiredHeaders.every((header) =>
        rows.includes(header)
      )

      return { data: hasAllHeaders }
    } catch (_err) {
      const err = _err as Error

      return { error: err }
    }
  }

  async function create(name: string) {
    try {
      const doc = await GoogleSpreadsheet.createNewSpreadsheetDocument(auth, {
        title: name,
        locale: 'en',
      })

      await doc.loadInfo()
      const sheet = doc.sheetsByIndex[0]
      await sheet.setHeaderRow(requiredHeaders)

      return {
        data: doc.spreadsheetId,
      }
    } catch (error) {
      return { error: error as Error }
    }
  }

  return { create, validate }
}
