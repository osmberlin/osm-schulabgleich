import { QueryClient } from '@tanstack/react-query'
import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import { AppFooter } from './components/AppFooter'
import { de } from './i18n/de'
import { HomePage } from './pages/HomePage'
import { LandLayout } from './pages/LandLayout'
import { LandOverview } from './pages/LandOverview'
import { SchuleDetail } from './pages/SchuleDetail'
import { StatusPage } from './pages/StatusPage'

const rootRoute = createRootRoute({
  component: () => (
    <NuqsAdapter>
      <div className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:p-2"
        >
          Zum Inhalt
        </a>
        <header className="border-b border-zinc-200 bg-brand-50 dark:border-zinc-800 dark:bg-brand-950/60">
          <div className="mx-auto max-w-5xl px-4 py-3">
            <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">
              {de.appTitle}
            </p>
          </div>
        </header>
        <main id="main" className="min-h-[70vh]">
          <Outlet />
        </main>
        <AppFooter />
      </div>
    </NuqsAdapter>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const statusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/status',
  component: StatusPage,
})

const landRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bundesland/$code',
  component: LandLayout,
})

const landIndexRoute = createRoute({
  getParentRoute: () => landRoute,
  path: '/',
  component: LandOverview,
})

const schuleRoute = createRoute({
  getParentRoute: () => landRoute,
  path: 'schule/$matchKey',
  component: SchuleDetail,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  statusRoute,
  landRoute.addChildren([landIndexRoute, schuleRoute]),
])

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
})

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
