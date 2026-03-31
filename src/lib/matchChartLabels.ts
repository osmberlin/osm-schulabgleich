import { de } from '../i18n/de'
import type { MatchHistoryChartLabels } from './matchHistoryFromRuns'

/** Ein Label-Satz für gestapelte Verlaufsdiagramme (vier Abgleichkategorien + `official_no_coord`). */
export const MATCH_CHART_LABELS: MatchHistoryChartLabels = {
  ...de.land.categoryLabel,
  official_no_coord: de.land.officialNoCoordKpi,
}
