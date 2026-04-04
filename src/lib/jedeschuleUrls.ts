/** Single-school JSON as in the UI (“Auf JedeSchule öffnen (JSON)”). */
export function jedeschuleSchoolJsonUrl(officialId: string): string {
  return `https://jedeschule.codefor.de/schools/${encodeURIComponent(officialId)}`
}
