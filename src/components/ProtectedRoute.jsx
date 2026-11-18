import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentUser } from '../services'

// Protège les routes placées à l'intérieur dans le router.
// - pas connecté          -> redirection vers /connexion
// - connecté, mauvais rôle -> redirection vers l'accueil
// - sinon                  -> la page s'affiche (<Outlet />)
//
// role (facultatif) : rôle obligatoire, ex. "Directeur". Sans role, être connecté suffit.
export default function ProtectedRoute({ role }) {
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/connexion" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
