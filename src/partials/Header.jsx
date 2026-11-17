import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import logo from '../assets/logos/logo-hogward.png'

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

const loginClass =
  'bg-texture-castle rounded-md border border-stone/60 px-5 py-2.5 font-bold transition-colors hover:border-parchment hover:bg-parchment hover:text-castle'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-texture-castle sticky top-0 z-50 border-b border-black/40 text-parchment">
      <div className="mx-auto flex h-19 max-w-360 items-center justify-between gap-6 px-4 md:px-12">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="" className="h-14 w-12 object-cover" />
          <span className="flex flex-col leading-none">
            <span className="font-title text-xl font-bold tracking-wide">Poudlard</span>
            <span className="mt-1 text-[0.65rem] font-semibold tracking-[0.3em] text-brass uppercase">
              Emploi Du Temps
            </span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end className={navLinkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          to="/connexion"
          className={`${loginClass} hidden md:block`}
        >
          Se connecter
        </Link>

        <button
          type="button"
          className="rounded-md border border-stone/60 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen(!open)}
        >
          <FontAwesomeIcon icon={open ? faXmark : faBars} className="text-xl" />
        </button>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Navigation principale" className="border-t border-white/10 px-4 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end className={navLinkClass} onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            to="/connexion"
            className={`${loginClass} mt-6 block text-center`}
            onClick={() => setOpen(false)}
          >
            Se connecter
          </Link>
        </nav>
      )}
    </header>
  )
}
