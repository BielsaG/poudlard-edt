import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { Home, Login, NotFound, Profile, Register, Staff, Subjects } from './pages'
import { ProtectedRoute } from './components'
import AdminLayout, { AdminHome } from './pages/admin/AdminLayout.jsx'
import AdminSubjects from './pages/admin/AdminSubjects.jsx'
import AdminStudents from './pages/admin/AdminStudents.jsx'
import AdminClasses from './pages/admin/AdminClasses.jsx'
import PlanningLayout, { PlanningHome } from './pages/planning/PlanningLayout.jsx'
import PlanningEdt from './pages/planning/PlanningEdt.jsx'
import PlanningSubjects from './pages/planning/PlanningSubjects.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'connexion', element: <Login /> },
      { path: 'inscription', element: <Register /> },
      { path: 'register', element: <Register /> },
      { path: 'staff', element: <Staff /> },
      { path: 'matieres', element: <Subjects /> },

      // ---- Pages réservées aux utilisateurs connectés ----
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'planning',
            element: <PlanningLayout />,
            children: [
              { index: true, element: <PlanningHome /> },
              { path: 'edt', element: <PlanningEdt /> },
              { path: 'matieres', element: <PlanningSubjects /> },
              // Onglet Élèves réservé aux professeurs (réutilise la page admin)
              {
                element: <ProtectedRoute role="Professeur" />,
                children: [{ path: 'eleves', element: <AdminStudents /> }],
              },
            ],
          },
          { path: 'sorciers/:id', element: <Profile /> },
          // { path: 'emploi-du-temps', element: <Timetable /> },
          // { path: 'emploi-du-temps/:type/:id', element: <Timetable /> },
        ],
      },

      // ---- Pages réservées au directeur (gérant) ----
      {
        element: <ProtectedRoute role="Directeur" />,
        children: [
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
        ],
      },

      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
