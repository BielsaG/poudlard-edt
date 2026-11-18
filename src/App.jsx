import { Outlet } from 'react-router-dom'
import { Header, Footer } from './partials'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default App
