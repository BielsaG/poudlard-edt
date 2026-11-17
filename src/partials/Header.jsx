import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import logo from '../assets/logos/logo-hogward.png'
import Navbar from './Navbar'

const IS_LOGGED_IN = false
const FAKE_USER = { id: '3a8f', firstName: 'Albus', lastName: 'Dumbledore', role: 'Gérant' }
const user = IS_LOGGED_IN ? FAKE_USER : null

export default function Header() {
  const [open, setOpen] = useState(false)
  const closeMenu = () => setOpen(false)

  return (
    <header className="bg-texture-castle sticky top-0 z-50 border-b border-black/40 text-parchment">
      <div className="mx-auto flex h-19 max-w-360 items-center justify-between gap-6 px-4 md:px-12">
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <img src={logo} alt="" className="h-14 w-12 object-cover" />
          <span className="flex flex-col leading-none">
            <span className="font-title text-xl font-bold tracking-wide">Poudlard</span>
            <span className="mt-1 text-[0.65rem] font-semibold tracking-[0.3em] text-brass uppercase">
              Emploi Du Temps
            </span>
          </span>
        </Link>

        <div className="hidden flex-1 md:flex">
          <Navbar user={user} />
        </div>

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
        <div id="menu-mobile" className="border-t border-white/10 px-4 pb-6 md:hidden">
          <Navbar user={user} mobile onNavigate={closeMenu} />
        </div>
      )}
    </header>
  )
}
