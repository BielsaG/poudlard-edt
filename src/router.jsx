import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { 
  Home, 
  NotFound, 
  Profile,
  Staff,
  Subjects } from './pages'
import { getWizardProfile } from './services'

async function profileLoader({ params }) {
  return getWizardProfile(params.id)
}

// Routes de l'application (voir CAHIER_DES_CHARGES.md, section 5)
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Layout commun (header, nav, footer...)
    children: [
      // ---- Pages publiques ----
      { index: true, element: <Home /> },
      // { path: 'connexion', element: <Login /> },
      { path: 'staff', element: <Staff /> },
      { path: 'matieres', element: <Subjects /> },

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
