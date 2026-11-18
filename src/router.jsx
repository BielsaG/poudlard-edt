import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
<<<<<<< Updated upstream
import { Home, NotFound, Profile, Staff, Subjects } from './pages'
import { getWizardProfile } from './services'
import AdminLayout, { AdminHome } from './pages/admin/AdminLayout.jsx'
import AdminSubjects from './pages/admin/AdminSubjects.jsx'
import AdminStudents from './pages/admin/AdminStudents.jsx'
import AdminClasses from './pages/admin/AdminClasses.jsx'

async function profileLoader({ params }) {
  return getWizardProfile(params.id)
}
=======
import { Home, Login, NotFound, Profile, Register, Staff, Subjects } from './pages'
>>>>>>> Stashed changes

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
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminHome /> },
          { path: 'matieres', element: <AdminSubjects /> },
          { path: 'eleves', element: <AdminStudents /> },
          { path: 'classes', element: <AdminClasses /> },
        ],
      },

      // ---- Pages connectées ----
      // { path: 'emploi-du-temps', element: <Timetable /> },
      // { path: 'emploi-du-temps/:type/:id', element: <Timetable /> },
      { path: 'sorciers/:id', element: <Profile /> },

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
