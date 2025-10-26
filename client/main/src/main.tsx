import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.scss'
import App from './App.tsx'
import { I18nProvider } from './i18n/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider defaultLocale={'ru'}>
      <App />
    </I18nProvider>
  </StrictMode>,
)
