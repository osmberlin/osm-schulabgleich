/** DOM id for compare UI tied to a JedeSchule school id (map scroll targets use the same string). */
export function schoolDetailCompareSectionId(officialId: string): string {
  return `school-detail-compare-${officialId}`
}

export function scrollToSchoolDetailCompareSection(elementId: string) {
  requestAnimationFrame(() => {
    const el = document.getElementById(elementId)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const parentDetails = el.closest('details')
    if (parentDetails) parentDetails.open = true
  })
}
