import { Outlet } from 'react-router-dom'
import { Header, Footer } from './partials'

function App() {
  return (
    // min-h-screen + flex-1 sur <main> : le footer reste en bas même si la page est courte
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default App
