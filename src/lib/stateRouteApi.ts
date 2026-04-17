import { getRouteApi } from '@tanstack/react-router'

export const stateRouteApi = getRouteApi('/bundesland/$code')
export const stateSchuleRouteApi = getRouteApi('/bundesland/$code/schule/$matchKey')
