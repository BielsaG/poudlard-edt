import { createBrowserRouter, redirect } from 'react-router-dom'
import App from './App.jsx'
import { Home, Login, NotFound, Profile, Register, Staff, Subjects } from './pages'
import { getCurrentUser, getWizardProfile } from './services'

async function profileLoader({ params }) {
  if (!getCurrentUser()) {
    throw redirect('/connexion')
  }

  return getWizardProfile(params.id)
}

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

      // { path: 'emploi-du-temps', element: <Timetable /> },
      // { path: 'emploi-du-temps/:type/:id', element: <Timetable /> },
      { path: 'sorciers/:id', element: <Profile />, loader: profileLoader },

      // {
      //   path: 'admin',
      //   children: [
      //     { index: true, element: <Dashboard /> },
      //     { path: 'sorciers', element: <WizardList /> },
      //     { path: 'sorciers/nouveau', element: <WizardForm /> },
      //     { path: 'sorciers/:id/modifier', element: <WizardForm /> },
      //   ],
      // },

      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
