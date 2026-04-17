import { PrimarySchoolOsmSuggest } from '../components/school/PrimarySchoolOsmSuggest'
import { SchoolDetailActionLinks } from '../components/school/SchoolDetailActionLinks'
import {
  SchoolDetailAmbiguousAlert,
  SchoolDetailJedeschuleDuplicateGroupNote,
  SchoolDetailOfficialNoCoordLead,
  SchoolDetailOutsideBoundaryAlert,
} from '../components/school/SchoolDetailAlerts'
import { SchoolDetailAmbiguousCandidateItem } from '../components/school/SchoolDetailAmbiguousCandidateItem'
import { SchoolDetailCompareBody } from '../components/school/SchoolDetailCompareBody'
import { SchoolDetailLicenceWarnings } from '../components/school/SchoolDetailLicence'
import {
  type HoveredMapLabel,
  SchoolDetailMap,
  type SchoolDetailMapRenderData,
  SchoolDetailMapLegend,
} from '../components/school/SchoolDetailMap'
import { SchoolDetailMatchExplanation } from '../components/school/SchoolDetailMatchExplanation'
import { de } from '../i18n/de'
import { buildIdUrl, buildJosmLoadObject, buildOsmBrowseUrl } from '../lib/editorLinks'
import { fetchStateSchoolsBundle } from '../lib/fetchStateSchoolsBundle'
import { findOfficialSchoolFeature } from '../lib/findOfficialSchoolFeature'
import { formatDeInteger } from '../lib/formatNumber'
import { jedeschuleSchoolJsonUrl } from '../lib/jedeschuleUrls'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  buildOfficialSchoolLonLatIndex,
  matchRowDisplayName,
  matchRowMapLonLat,
  spreadCoincidentMapPointFeatures,
} from '../lib/matchRowInBbox'
import { findOsmFeature } from '../lib/osmFeatureLookup'
import { osmGeometryCentroidLonLat } from '../lib/osmGeometryCentroid'
import { schoolDetailCompareSectionId } from '../lib/schoolDetailCompareSectionIds'
import { buildSchoolDetailMapLayerFeatures } from '../lib/schoolDetailMapLayerFeatures'
import { stateLabelDeFromRouteCode } from '../lib/stateConfig'
import { useDetailMapMask } from '../lib/useDetailMapMask'
import { useDetailMapParam } from '../lib/useDetailMapParam'
import { deriveSchoolAmbiguousCandidates } from '../lib/useSchoolAmbiguousCandidates'
import { deriveSchoolDetailMapFeatures } from '../lib/useSchoolDetailMapFeatures'
import { useSchoolDetailRoute } from '../lib/useSchoolDetailRoute'
import type { StateMapBbox } from '../lib/useStateMapBbox'
import {
  parseErrorOutsideBoundaryFromOfficialProps,
  parseJedeschuleLonLatFromRecord,
  parseMatchRowOsmCentroidLonLat,
} from '../lib/zodGeo'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import bbox from '@turf/bbox'
import { featureCollection } from '@turf/helpers'
import type { Feature, FeatureCollection } from 'geojson'
import { useEffect, useState } from 'react'
import { MapProvider, type ViewStateChangeEvent } from 'react-map-gl/maplibre'

function scrollToSchoolDetailCompareSection(elementId: string) {
  requestAnimationFrame(() => {
    const el = document.getElementById(elementId)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const parentDetails = el.closest('details')
    if (parentDetails) parentDetails.open = true
  })
}

type StateSchoolsBundle = Awaited<ReturnType<typeof fetchStateSchoolsBundle>>
type StateSchoolMatchRow = StateSchoolsBundle['matches'][number]

function resolveSchoolMapOsmCentroid(
  data: StateSchoolsBundle | undefined,
  matchRow: StateSchoolMatchRow | null,
): readonly [number, number] | null {
  if (!data || !matchRow) return null

  const fromRow = parseMatchRowOsmCentroidLonLat(matchRow)
  if (fromRow) return fromRow

  const fromOsmFeature = findOsmFeature(data.osm, matchRow.osmType, matchRow.osmId)
  if (fromOsmFeature?.geometry) {
    const centroid = osmGeometryCentroidLonLat(fromOsmFeature.geometry)
    if (centroid) return centroid
  }

  const fromOfficialProps = parseJedeschuleLonLatFromRecord(
    matchRow.officialProperties ?? undefined,
  )
  if (fromOfficialProps) return fromOfficialProps

  if (!matchRow.officialId) return null
  const officialFeature = findOfficialSchoolFeature(data.official, matchRow.officialId)
  if (!officialFeature?.geometry) return null
  if (officialFeature.geometry.type === 'Point') {
    const [lon, lat] = officialFeature.geometry.coordinates
    return [lon, lat] as const
  }
  return osmGeometryCentroidLonLat(officialFeature.geometry)
}

export function SchoolDetail() {
  const { code, matchKey, navigate } = useSchoolDetailRoute()
  const { showMapMask, setShowMapMask } = useDetailMapMask()
  const { map: detailMapSearch, setMap: setDetailMapSearch } = useDetailMapParam()
  const [detailMapBbox, setDetailMapBbox] = useState<StateMapBbox | null>(null)
  const [hoveredMapLabel, setHoveredMapLabel] = useState<HoveredMapLabel | null>(null)

  const q = useQuery({
    queryKey: ['school-detail', code, matchKey],
    queryFn: () => fetchStateSchoolsBundle(code),
  })

  const matchRow = q.data?.matches.find((r) => r.key === matchKey) ?? null

  let errorOutsideBoundary: ReturnType<typeof parseErrorOutsideBoundaryFromOfficialProps> = null
  if (matchRow) {
    const fromMain = parseErrorOutsideBoundaryFromOfficialProps(matchRow.officialProperties ?? null)
    if (fromMain) {
      errorOutsideBoundary = fromMain
    } else {
      for (const s of matchRow.ambiguousOfficialSnapshots ?? []) {
        const p = parseErrorOutsideBoundaryFromOfficialProps(s.properties ?? null)
        if (p) {
          errorOutsideBoundary = p
          break
        }
      }
    }
  }

  const stateLabelDe = stateLabelDeFromRouteCode(code)

  /**
   * Karten-Schwerpunkt: zuerst OSM (wie Matcher), sonst OSM-Geometrie, sonst amtliche
   * Koordinaten — damit z. B. Grundschule-Vorschläge und Kartenmarker auch ohne
   * gespeicherten OSM-Schwerpunkt im JSON funktionieren.
   */
  const mapOsmCentroid = resolveSchoolMapOsmCentroid(q.data, matchRow)

  const { ambiguousCandidates, ambiguousNoLocalGeoFeature } = deriveSchoolAmbiguousCandidates(
    q.data,
    matchRow,
    mapOsmCentroid,
  )

  const {
    detailFeatures,
    compareRadiusRing,
    detailMapMaskFeature,
    connectorLineFeatures,
    hoverRelationLineFeatures,
  } = deriveSchoolDetailMapFeatures(q.data, matchRow, mapOsmCentroid, hoveredMapLabel)

  /** True coordinates (one match per `matchKey`); bbox filtering uses these, not display spread. */
  const allOtherSchoolPointFeatures: Feature[] = (() => {
    const features: Feature[] = []
    if (!q.data) return features
    const officialFc = q.data.official as FeatureCollection
    const officialLonLatIndex = officialFc?.features?.length
      ? buildOfficialSchoolLonLatIndex(officialFc)
      : null
    const seen = new Set<string>()
    for (const match of q.data.matches) {
      if (match.key === matchKey) continue
      if (seen.has(match.key)) continue
      seen.add(match.key)
      const lonLat = matchRowMapLonLat(match, officialLonLatIndex)
      if (!lonLat) continue
      const [lon, lat] = lonLat
      features.push({
        type: 'Feature',
        properties: {
          matchKey: match.key,
          name: matchRowDisplayName(match),
          matchCat: match.matchCategory ?? match.category,
        },
        geometry: { type: 'Point', coordinates: [lon, lat] },
      })
    }
    return features
  })()

  const otherSchoolPointFeatures: Feature[] = !detailMapBbox
    ? []
    : (() => {
        const [w, s, e, n] = detailMapBbox
        const inView = allOtherSchoolPointFeatures.filter((f) => {
          if (f.geometry?.type !== 'Point') return false
          const [lon, lat] = f.geometry.coordinates
          return lon >= w && lon <= e && lat >= s && lat <= n
        })
        return spreadCoincidentMapPointFeatures(inView)
      })()

  const { detailMapFeatures, detailMapPolygonFeatures, detailMapPointFeatures } =
    buildSchoolDetailMapLayerFeatures(
      detailFeatures,
      connectorLineFeatures,
      hoverRelationLineFeatures,
    )

  /** fitBounds ohne Bundesland-Maske (sonst zu weit herausgezoomt). */
  const detailMapBoundsFeatures: Feature[] =
    detailFeatures.length === 0
      ? []
      : [
          ...detailFeatures,
          ...(compareRadiusRing ? [compareRadiusRing] : []),
          ...connectorLineFeatures,
        ]

  /** Bbox of the official point + OSM feature + Abgleichsradius (unsichtbar, nur für Zoom). */
  const bounds =
    detailMapBoundsFeatures.length === 0
      ? null
      : (bbox(featureCollection(detailMapBoundsFeatures)) as [number, number, number, number])

  const detailTargetViewState = detailMapSearch
    ? (() => {
        const [zoom, lat, lon] = detailMapSearch
        return { latitude: lat, longitude: lon, zoom, pitch: 0, bearing: 0 }
      })()
    : { latitude: 51, longitude: 10, zoom: 14, pitch: 0, bearing: 0 }
  const [detailMapViewState, setDetailMapViewState] = useState(detailTargetViewState)
  const detailMapFitBounds: [[number, number], [number, number]] | null = bounds
    ? ([
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ] as [[number, number], [number, number]])
    : null

  useEffect(() => {
    setDetailMapViewState((prev) => {
      const sameZoom = Math.abs(prev.zoom - detailTargetViewState.zoom) < 0.0005
      const sameLat = Math.abs(prev.latitude - detailTargetViewState.latitude) < 0.000001
      const sameLon = Math.abs(prev.longitude - detailTargetViewState.longitude) < 0.000001
      if (sameZoom && sameLat && sameLon) return prev
      return detailTargetViewState
    })
  }, [
    detailTargetViewState.zoom,
    detailTargetViewState.latitude,
    detailTargetViewState.longitude,
    detailTargetViewState.pitch,
    detailTargetViewState.bearing,
  ])

  const handleDetailMapMoveEnd = (e: ViewStateChangeEvent) => {
    const { zoom, latitude, longitude } = e.viewState
    if (
      detailMapSearch &&
      Math.abs(detailMapSearch[0] - zoom) < 0.0005 &&
      Math.abs(detailMapSearch[1] - latitude) < 0.000001 &&
      Math.abs(detailMapSearch[2] - longitude) < 0.000001
    ) {
      return
    }
    void setDetailMapSearch([zoom, latitude, longitude])
  }

  const mapRenderData: SchoolDetailMapRenderData = {
    detailMapMaskFeature,
    detailMapPolygonFeatures,
    connectorLineFeatures,
    hoverRelationLineFeatures,
    boundary: (q.data?.boundary as Feature | null) ?? null,
    detailMapPointFeatures,
    otherSchoolPointFeatures,
  }

  const handleDetailOtherSchoolClick = (nextKey: string) => {
    void navigate({
      to: '/bundesland/$code/schule/$matchKey',
      params: { code, matchKey: nextKey },
      search: (prev) => ({
        ...prev,
        map: undefined,
        bbox: undefined,
      }),
    })
  }

  const handleDetailOfficialPointClick = (officialId: string) => {
    scrollToSchoolDetailCompareSection(schoolDetailCompareSectionId(officialId))
  }

  if (q.isLoading) return <p className="text-zinc-400">{de.state.loading}</p>
  if (q.isError) return <p className="text-red-400">{de.state.error}</p>
  if (!matchRow) {
    return (
      <p className="text-zinc-400">
        {de.detail.notFound}{' '}
        <Link to="/bundesland/$code" params={{ code }} className="text-emerald-300">
          ←
        </Link>
      </p>
    )
  }

  return (
    <>
      {detailMapFeatures.length > 0 && (
        <div className="mb-8">
          <div className="relative h-[360px] overflow-hidden rounded-lg border border-zinc-700">
            <MapProvider>
              <SchoolDetailMap
                viewState={detailMapViewState}
                hoveredMapLabel={hoveredMapLabel}
                currentSchoolCategory={matchRow.matchCategory ?? matchRow.category}
                osmReferenceName={matchRow.osmName ?? matchRow.key}
                detailMapSearch={detailMapSearch}
                detailMapFitBounds={detailMapFitBounds}
                showMapMask={showMapMask}
                renderData={mapRenderData}
                fallbackViewKey={matchKey}
                onMapBboxChange={setDetailMapBbox}
                onMapViewStateChange={(next) => {
                  setDetailMapViewState((prev) => {
                    const sameZoom = Math.abs(prev.zoom - next.zoom) < 0.0005
                    const sameLat = Math.abs(prev.latitude - next.latitude) < 0.000001
                    const sameLon = Math.abs(prev.longitude - next.longitude) < 0.000001
                    if (sameZoom && sameLat && sameLon) return prev
                    return next
                  })
                }}
                onHoveredMapLabelChange={setHoveredMapLabel}
                onOtherSchoolClick={handleDetailOtherSchoolClick}
                onOfficialPointClick={handleDetailOfficialPointClick}
                onMoveEnd={handleDetailMapMoveEnd}
              />
            </MapProvider>
          </div>
          <SchoolDetailMapLegend
            mapOsmCentroid={mapOsmCentroid}
            allOtherSchoolPointFeatures={allOtherSchoolPointFeatures}
            showMapMask={showMapMask}
            onShowMapMaskChange={setShowMapMask}
          />
        </div>
      )}

      <SchoolDetailActionLinks
        idUrl={buildIdUrl(matchRow.osmType, matchRow.osmId, bounds)}
        josmUrl={buildJosmLoadObject(matchRow.osmType, matchRow.osmId, bounds)}
        jedeschuleItemUrl={
          matchRow.officialId &&
          !(matchRow.ambiguousOfficialIds && matchRow.ambiguousOfficialIds.length > 0)
            ? jedeschuleSchoolJsonUrl(matchRow.officialId)
            : null
        }
        osmBrowseUrl={buildOsmBrowseUrl(matchRow.osmType, matchRow.osmId)}
      />

      <SchoolDetailLicenceWarnings />

      <SchoolDetailOutsideBoundaryAlert
        outsideBoundary={errorOutsideBoundary}
        stateLabelDe={stateLabelDe}
      />

      <SchoolDetailOfficialNoCoordLead category={matchRow.category} />

      <SchoolDetailJedeschuleDuplicateGroupNote
        officialProperties={matchRow.officialProperties ?? null}
      />

      <SchoolDetailMatchExplanation row={matchRow} />

      <PrimarySchoolOsmSuggest
        row={matchRow}
        lon={mapOsmCentroid?.[0] ?? null}
        lat={mapOsmCentroid?.[1] ?? null}
      />

      {ambiguousCandidates.length > 0 ? (
        <div className="space-y-6">
          <SchoolDetailAmbiguousAlert
            showNameNoGeoText={matchRow.matchMode === 'name'}
            showNoLocalGeoText={ambiguousNoLocalGeoFeature}
          />
          <h2 className="flex flex-row flex-wrap items-center gap-x-2 text-base font-semibold text-zinc-100">
            <span>{de.detail.ambiguousOfficialHeading}</span>
            <span className="inline-flex shrink-0 items-center rounded-full border border-zinc-300/90 bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 tabular-nums">
              {formatDeInteger(ambiguousCandidates.length)}
            </span>
          </h2>
          {ambiguousCandidates.map((c, idx) => (
            <SchoolDetailAmbiguousCandidateItem
              key={c.id}
              candidate={c}
              index={idx}
              osm={matchRow.osmTags ?? null}
              osmTypeForHeader={matchRow.osmType}
              osmIdForHeader={matchRow.osmId}
            />
          ))}
        </div>
      ) : (
        <div
          id={
            matchRow.officialId != null
              ? schoolDetailCompareSectionId(matchRow.officialId)
              : undefined
          }
        >
          <SchoolDetailCompareBody
            official={matchRow.officialProperties ?? null}
            osm={matchRow.osmTags ?? null}
            officialIdForHeader={matchRow.officialId}
            osmTypeForHeader={matchRow.osmType}
            osmIdForHeader={matchRow.osmId}
          />
        </div>
      )}
    </>
  )
}
