import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { I18nProvider } from './i18n'
import LandingPage from './LandingPage'
import BookPage from './BookPage'

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/book" element={<BookPage />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  )
}

export default App
