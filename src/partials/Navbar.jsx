import { Link, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/staff', label: 'Le staff' },
  { to: '/matieres', label: 'Les matières' },
]

const baseClass = 'border-b-2 pb-1 font-semibold transition-colors'

const navLinkClass = ({ isActive }) => {
  if (isActive) {
    // Lien actif
    return `${baseClass} border-brass text-parchment`
  }
  // Lien inactif
  return `${baseClass} border-transparent text-stone hover:border-brass hover:text-parchment`
}

const buttonClass =
  'bg-texture-castle rounded-md border border-stone/60 font-bold transition-colors hover:border-parchment hover:bg-parchment hover:text-castle'

export default function Navbar({ user, mobile = false, onNavigate }) {
  if (user) {
    function logout() {
      onNavigate?.()
    }

    return (
      <div className={mobile ? 'flex items-center justify-between pt-4' : 'ml-auto flex items-center gap-4'}>
        <Link to={`/sorciers/${user.id}`} className="flex items-center gap-3" onClick={onNavigate}>
          <span className="flex size-10 items-center justify-center rounded-full border-2 border-stone bg-stone-light font-bold text-castle">
            {user.firstName[0]}
            {user.lastName[0]}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-bold">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-sm text-stone">{user.role}</span>
          </span>
        </Link>

        <button type="button" onClick={logout} className={`${buttonClass} p-2.5`} aria-label="Se déconnecter" title="Se déconnecter">
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-lg" />
        </button>
      </div>
    )
  }

  // ---- Visiteur : liens publics + bouton de connexion ---
  return (
    <div className={mobile ? 'flex flex-col gap-6 pt-4' : 'flex flex-1 items-center'}>
      <nav aria-label="Navigation principale" className={mobile ? '' : 'mx-auto'}>
        <ul className={mobile ? 'flex flex-col gap-4' : 'flex items-center gap-8'}>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end className={navLinkClass} onClick={onNavigate}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Link to="/connexion" className={`${buttonClass} px-5 py-2.5 text-center`} onClick={onNavigate}>
        Se connecter
      </Link>
    </div>
  )
}
