import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import { AppProvider } from './app/providers/AppProvider'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <BrowserRouter basename={routerBasename}>
      <App />
    </BrowserRouter>
  </AppProvider>
)
