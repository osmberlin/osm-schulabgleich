import { de } from '../../i18n/de'

const WIKI_LINKS = [
  {
    href: 'https://wiki.openstreetmap.org/wiki/DE:Tag:amenity%3Dschool',
    label: 'Tag:amenity=school',
  },
  {
    href: 'https://wiki.openstreetmap.org/wiki/DE:Key:school',
    label: 'Key:school',
  },
  {
    href: 'https://wiki.openstreetmap.org/wiki/DE:Key:isced:level#Werte_f%C3%BCr_Deutschland',
    label: 'Key:isced:level',
  },
] as const

export function SchoolOsmTagWikiLinks() {
  return (
    <p className="mt-3 text-sm text-zinc-300">
      {de.osm.schoolTagWikiLead}{' '}
      {WIKI_LINKS.map((link, idx) => (
        <span key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 underline underline-offset-2 hover:text-sky-300"
          >
            {link.label}
          </a>
          {idx < WIKI_LINKS.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}
