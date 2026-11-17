import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'
import { getWizardProfile } from './services'

async function profileLoader({ params }) {
  return getWizardProfile(params.id)
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Layout commun (header, nav, footer...)
    children: [
      // ---- Pages publiques ----
      { index: true, element: <Home /> },
      { path: 'inscription', element: <Register /> },
      { path: 'register', element: <Register /> },
      // { path: 'connexion', element: <Login /> },
      // { path: 'staff', element: <Staff /> },
      // { path: 'matieres', element: <Subjects /> },

      // ---- Pages connectées ----
      // { path: 'emploi-du-temps', element: <Timetable /> },
      // { path: 'emploi-du-temps/:type/:id', element: <Timetable /> },
      { path: 'sorciers/:id', element: <Profile />, loader: profileLoader },

      // ---- Pages gérant ----
      // {
      //   path: 'admin',
      //   children: [
      //     { index: true, element: <Dashboard /> },
      //     { path: 'sorciers', element: <WizardList /> },
      //     { path: 'sorciers/nouveau', element: <WizardForm /> },
      //     { path: 'sorciers/:id/modifier', element: <WizardForm /> },
      //   ],
      // },

      // ---- 404 : doit rester en dernier ----
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
