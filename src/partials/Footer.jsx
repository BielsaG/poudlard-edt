import { Link } from 'react-router-dom'
import logo from '../assets/logo-footer.svg'

const links = [
  { to: '/staff', label: 'Le staff' },
  { to: '/matieres', label: 'Les matières' },
  { to: '/admin', label: 'Espace de gestion' },
]

export default function Footer() {
  return (
    <footer className="bg-castle text-parchment">
      <div className="mx-auto flex max-w-360 flex-col items-center gap-8 px-4 py-12 text-center md:flex-row md:justify-between md:px-26 md:text-left">
        {/* Logo + baseline */}
        <Link to="/" className="flex items-center gap-4">
          <img src={logo} alt="" className="h-12 w-9" />
          <span className="flex flex-col">
            <span className="font-title text-lg font-bold tracking-wide">Poudlard's Timetable</span>
            <span className="text-xs text-stone">Organisation scolaire depuis 990</span>
          </span>
        </Link>

        {/* Liens */}
        <nav aria-label="Liens du pied de page">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-stone-light transition-colors hover:text-brass-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-xs text-stone">© 1993 Poudlard</p>
      </div>
    </footer>
  )
}
