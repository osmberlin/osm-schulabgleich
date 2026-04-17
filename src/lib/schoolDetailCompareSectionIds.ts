/** DOM id for compare UI tied to a JedeSchule school id (map scroll targets use the same string). */
export function schoolDetailCompareSectionId(officialId: string): string {
  return `school-detail-compare-${officialId}`
}
