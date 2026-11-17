import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Profile from './pages/Profile.jsx'

const API = 'http://localhost:3000'

async function profileLoader({ params }) {
  const responses = await Promise.all([
    fetch(`${API}/wizards/${params.id}`),
    fetch(`${API}/roles`),
    fetch(`${API}/houses`),
    fetch(`${API}/classes`),
  ])

  if (responses.some((response) => !response.ok)) {
    throw new Response('Impossible de charger le profil', { status: 500 })
  }

  const [wizardResponse, rolesResponse, housesResponse, classesResponse] =
    responses
  const wizard = await wizardResponse.json()
  const roles = await rolesResponse.json()
  const houses = await housesResponse.json()
  const classes = await classesResponse.json()

  return {
    prenom: wizard.firstName,
    nom: wizard.lastName,
    email: wizard.email,
    photo: wizard.avatar,
    roles: wizard.roleIds.map(
      (roleId) => roles.find((role) => role.id === roleId)?.label || roleId,
    ),
    maison: houses.find((house) => house.id === wizard.houseId)?.name || '',
    classe: classes.find((classe) => classe.id === wizard.classId)?.name || '',
    villeOrigine: '',
    animal: '',
    baguette: {},
  }
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
