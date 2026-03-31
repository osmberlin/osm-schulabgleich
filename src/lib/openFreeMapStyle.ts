import type { Map as MaplibreMap } from 'maplibre-gl'

/**
 * OpenFreeMap public style (no API key). Use the style base URL as in the
 * [Quick Start](https://openfreemap.org/quick_start/) — not `…/style.json`
 * (that path 404s).
 *
 * Positron: light, minimal basemap (good for data overlays / school polygons).
 */
export const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'

/**
 * MapLibre defaults for a flat 2D map: no globe projection, no pitch/3D tilt,
 * no drag-to-rotate. Spread onto `<MapGL />` next to `mapStyle`.
 */
export const flatMapGlProps = {
  projection: 'mercator' as const,
  maxPitch: 0,
  minPitch: 0,
  dragRotate: false,
  touchPitch: false,
}

/**
 * Disables keyboard shortcuts and two-finger gestures that rotate the map.
 * Call from `<MapGL onLoad={(e) => { applyFlatMapRotationLocks(e.target); … }} />`
 * (`dragRotate: false` in {@link flatMapGlProps} only covers mouse drag).
 */
export function applyFlatMapRotationLocks(map: MaplibreMap) {
  map.keyboard.disableRotation()
  map.touchZoomRotate.disableRotation()
}

/** Hide vector building layers (ids containing `building`) on the basemap. */
export function hideVectorBasemapBuildings(map: MaplibreMap) {
  const style = map.getStyle()
  if (!style?.layers) return
  for (const layer of style.layers) {
    if (!layer.id.toLowerCase().includes('building')) continue
    try {
      map.setLayoutProperty(layer.id, 'visibility', 'none')
    } catch {
      /* layer may not support layout */
    }
  }
}
