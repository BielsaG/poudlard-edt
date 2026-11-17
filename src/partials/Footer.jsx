import { Link } from 'react-router-dom'
import logo from '../assets/logos/logo-hogward.png'

const links = [
  { to: '/staff', label: 'Le staff' },
  { to: '/matieres', label: 'Les matières' },
  { to: '/admin', label: 'Espace de gestion' },
]

export default function Footer() {
  return (
    <footer className="bg-castle text-parchment">
      <div className="mx-auto flex max-w-360 flex-col items-center gap-8 px-4 py-12 text-center md:flex-row md:justify-between md:px-26 md:text-left">
        <Link to="/" className="flex items-center gap-4">
          <img src={logo} alt="" className="h-14 w-12 object-cover" />
          <span className="flex flex-col">
            <span className="font-title text-lg font-bold tracking-wide">Poudlard edt</span>
            <span className="text-xs text-stone">Organisation scolaire depuis 990</span>
          </span>
        </Link>

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

        <p className="text-xs text-stone">© {new Date().getFullYear()} Poudlard</p>
      </div>
    </footer>
  )
}
