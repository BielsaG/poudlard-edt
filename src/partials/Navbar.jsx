import { Link, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import UserMenu from './UserMenu'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/staff', label: 'Le staff' },
  { to: '/matieres', label: 'Les matières' },
]

const baseClass = 'border-b-2 pb-1 font-semibold transition-colors'

const navLinkClass = ({ isActive }) => {
  if (isActive) {
    return `${baseClass} border-brass text-parchment`
  }
  return `${baseClass} border-transparent text-stone hover:border-brass hover:text-parchment`
}

const buttonClass =
  'bg-texture-castle rounded-md font-bold transition-colors hover:border-parchment hover:bg-parchment hover:text-castle'

export default function Navbar({ user, mobile = false, onNavigate, onLogout }) {
  if (user) {
    function logout() {
      onLogout()
      onNavigate?.()
    }

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

        <div className={mobile ? 'flex items-end justify-between gap-4' : 'flex items-center gap-4'}>
          {/* Profil + menu déroulant (tableau de bord, mon profil) */}
          <UserMenu user={user} mobile={mobile} onNavigate={onNavigate} />

          <button type="button" onClick={logout} className={`${buttonClass} p-2.5`} aria-label="Se déconnecter" title="Se déconnecter">
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-lg" />
          </button>
        </div>
      </div>
    )
  }

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

      <Link to="/connexion" className={`${buttonClass} border border-stone/60 px-5 py-2.5 text-center`} onClick={onNavigate}>
        Se connecter
      </Link>
    </div>
  )
}
