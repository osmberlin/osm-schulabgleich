import { TZDate } from '@date-fns/tz'
import { format, isValid } from 'date-fns'
import { de as deLocale } from 'date-fns/locale/de'

/** ISO instant → `4.3.2025` (Europe/Berlin); `null` if missing or not a date. */
export function formatDeDate(iso: string | null | undefined): string | null {
  if (!iso) return null
  const d = new TZDate(iso, 'Europe/Berlin')
  return isValid(d) ? format(d, 'd.M.yyyy', { locale: deLocale }) : null
}
