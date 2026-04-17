import { stateSchuleRouteApi } from './stateRouteApi'
import { useNavigate } from '@tanstack/react-router'

/** Path params are already URI-decoded by TanStack Router; compare `matchKey` to bundle `matches[].key` as-is. */
export function useSchoolDetailRoute() {
  const { code, matchKey } = stateSchuleRouteApi.useParams()
  const navigate = useNavigate({ from: '/bundesland/$code/schule/$matchKey' })
  return { code, matchKey, navigate }
}
