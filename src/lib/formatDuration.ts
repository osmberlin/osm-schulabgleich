/** German, human-readable duration from milliseconds. */
export function formatDurationMs(ms: number): string {
  const totalSec = Math.round(ms / 1000)
  if (totalSec < 60) {
    return `${totalSec} s`
  }
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  if (sec === 0) {
    return min === 1 ? '1 Min.' : `${min} Min.`
  }
  return `${min} Min. ${sec} s`
}
