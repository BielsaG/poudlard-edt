import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.svg'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/staff', label: 'Le staff' },
  { to: '/matieres', label: 'Les matières' },
]

// Lien actif : texte clair + soulignement laiton
const navLinkClass = ({ isActive }) =>
  [
    'relative py-1 font-semibold transition-colors',
    'after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-brass after:transition-transform',
    isActive
      ? 'text-parchment after:scale-x-100'
      : 'text-stone hover:text-parchment after:scale-x-0 hover:after:scale-x-100',
  ].join(' ')

// Bouton connexion : fond texturé du header, au survol fond couleur des points + texte marron
const loginClass =
  'bg-texture-castle rounded-md border border-stone/60 px-5 py-2.5 font-bold transition-colors hover:border-parchment hover:bg-parchment hover:text-castle'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-texture-castle sticky top-0 z-50 border-b border-black/40 text-parchment">
      <div className="mx-auto flex h-19 max-w-360 items-center justify-between gap-6 px-4 md:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="" className="h-12 w-10" />
          <span className="flex flex-col leading-none">
            <span className="font-title text-xl font-bold tracking-wide">Poudlard's</span>
            <span className="mt-1 text-[0.65rem] font-semibold tracking-[0.3em] text-brass uppercase">
              Timetable
            </span>
          </span>
        </Link>

        {/* Navigation desktop */}
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

        {/* Bouton menu mobile */}
        <button
          type="button"
          className="rounded-md border border-stone/60 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen(!open)}
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Navigation mobile */}
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
