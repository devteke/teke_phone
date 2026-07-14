import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { RootLayout } from './routes/__root'
import { HomeScreen } from './routes/index'

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeScreen,
})

const routeTree = rootRoute.addChildren([indexRoute])

// CEF'te gerçek URL yok -> memory history
const history = createMemoryHistory({ initialEntries: ['/'] })

export const router = createRouter({ routeTree, history })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}