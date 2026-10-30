import { setWorkerUrl } from 'maplibre-gl'
// maplibre-gl 6 loads its worker as a separate ES module next to the main file.
// After bundling that file is not emitted, so let Vite bundle the worker and point maplibre to it.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

setWorkerUrl(workerUrl)
