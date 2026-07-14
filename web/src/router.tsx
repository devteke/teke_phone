import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { RootLayout } from './routes/__root'
import { HomeScreen } from './routes/index'
import { MessagesScreen } from './routes/messages/index'
import { ThreadScreen } from './routes/messages/thread'
import { ContactsScreen } from './routes/contacts/index'
import { NewContactScreen } from './routes/contacts/new'

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomeScreen })
const messagesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/messages', component: MessagesScreen })
const threadRoute = createRoute({ getParentRoute: () => rootRoute, path: '/messages/$partner', component: ThreadScreen })
const contactsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contacts', component: ContactsScreen })
const newContactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contacts/new', component: NewContactScreen })

const routeTree = rootRoute.addChildren([
  indexRoute,
  messagesRoute,
  threadRoute,
  contactsRoute,
  newContactRoute,
])

const history = createMemoryHistory({ initialEntries: ['/'] })

export const router = createRouter({ routeTree, history })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}