import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faGaugeHigh, faUser } from '@fortawesome/free-solid-svg-icons'

// Tableau de bord selon le rôle : gestion pour le directeur, planning pour les autres
function getDashboard(user) {
  if (user.role === 'Directeur') return { to: '/admin', label: 'Tableau de bord' }
  return { to: '/planning', label: 'Mon planning' }
}

// Liens : base commune + couleurs selon le fond
const itemBase = 'flex items-center gap-3 py-3 text-sm font-semibold tracking-wide transition-colors focus-visible:outline-none'
// Menu déroulant (fond clair) : texte pierre foncée, marron au survol
const itemLight = `${itemBase} px-6 text-stone-dark hover:bg-stone-light/60 hover:text-castle focus-visible:bg-stone-light/60 focus-visible:text-castle`
// Menu burger mobile (fond sombre du header) : texte pierre, parchemin au survol
const itemDark = `${itemBase} text-stone hover:text-parchment focus-visible:text-parchment`

// Profil de l'utilisateur connecté avec un menu déroulant (tableau de bord, profil)
// mobile : pas de menu déroulant, les liens sont affichés directement
export default function UserMenu({ user, mobile = false, onNavigate }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const lastPointer = useRef(null) // type du dernier appui sur le bouton : "mouse", "touch"...
  const dashboard = getDashboard(user)

  // Ferme le menu au clic en dehors ou avec la touche Échap
  useEffect(() => {
    if (!open) return

    function handleClick(event) {
      if (!menuRef.current.contains(event.target)) setOpen(false)
    }
    function handleKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function handleNavigate() {
    setOpen(false)
    onNavigate?.()
  }

  const identity = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-stone-light font-bold text-castle">
        {user.firstName[0]}
        {user.lastName[0]}
      </span>
      <span className="flex flex-col text-left leading-tight">
        <span className="font-bold">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-sm text-stone">{user.role}</span>
      </span>
    </>
  )

  // itemClass : style des liens selon le fond (itemLight ou itemDark)
  const renderLinks = (itemClass) => (
    <>
      <li>
        <Link to={dashboard.to} className={itemClass} onClick={handleNavigate}>
          <FontAwesomeIcon icon={faGaugeHigh} className="w-4 text-brass-dark" />
          {dashboard.label}
        </Link>
      </li>
      <li>
        <Link to={`/sorciers/${user.id}`} className={itemClass} onClick={handleNavigate}>
          <FontAwesomeIcon icon={faUser} className="w-4 text-brass-dark" />
          Mon profil
        </Link>
      </li>
    </>
  )

  // ---- Mobile : identité + liens à plat, dans le menu burger ----
  if (mobile) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">{identity}</div>
        <ul className="flex flex-col">{renderLinks(itemDark)}</ul>
      </div>
    )
  }

  // ---- Desktop : survol à la souris, clic au doigt ou au clavier ----
  // pointerType vaut "mouse", "touch" ou "pen" : on sait d'où vient l'action
  // (plus fiable que de deviner si l'écran est tactile)
  function handlePointerEnter(event) {
    if (event.pointerType === 'mouse') setOpen(true)
  }
  function handlePointerLeave(event) {
    if (event.pointerType === 'mouse') setOpen(false)
  }
  function handleClick() {
    // À la souris, le survol a déjà ouvert le menu : un clic ne doit pas le refermer.
    // Au doigt ou au clavier (Entrée / Espace), le clic ouvre et ferme.
    if (lastPointer.current === 'mouse') setOpen(true)
    else setOpen(!open)
    lastPointer.current = null
  }

  return (
    <div
      ref={menuRef}
      className="relative"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <button
        type="button"
        onPointerDown={(event) => (lastPointer.current = event.pointerType)}
        onClick={handleClick}
        aria-expanded={open}
        aria-controls="user-menu"
        className="flex items-center gap-3 rounded-md px-2 py-1 transition-colors hover:bg-white/5"
      >
        {identity}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs text-stone transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Le menu reste dans la page pour pouvoir s'animer (fondu + glissement).
          pt-2 au lieu de mt-2 : la zone entre le bouton et le menu fait partie du menu,
          la souris ne "sort" pas en descendant, donc il ne se referme pas.
          inert + aria-hidden quand il est fermé : liens ni cliquables, ni focusables, ni lus */}
      <div
        className={`absolute right-0 z-50 w-64 pt-2 transition duration-200 ease-out ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
        inert={!open}
        aria-hidden={!open}
      >
        {/* Panneau : fond parchemin clair et uni, bandeau laiton en haut */}
        <div
          id="user-menu"
          className="overflow-hidden rounded-sm border-t-4 border-brass bg-parchment-light shadow-xl shadow-castle/25"
        >
          {/* En-tête : qui est connecté */}
          <div className="px-6 py-4">
            <p className="font-title text-lg text-castle">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-stone-dark">{user.role}</p>
          </div>

          {/* Séparateur en retrait des bords (mx-6) : plus élégant qu'un trait pleine largeur */}
          <hr className="mx-6 border-stone/50" />

          <ul className="py-2">{renderLinks(itemLight)}</ul>
        </div>
      </div>
    </div>
  )
}
