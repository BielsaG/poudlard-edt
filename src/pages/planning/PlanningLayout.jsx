import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faFlask } from '@fortawesome/free-solid-svg-icons'

const tabs = [
  { path: 'edt', label: 'Mon emploi du temps', icon: faCalendarDays },
  { path: 'matieres', label: 'Mes Matières', icon: faFlask },
]

export default function PlanningLayout() {
  const today = new Date()
  const currentYear = today.getFullYear()
  const month = today.getMonth()
  const schoolYearStart = month >= 8 ? currentYear : currentYear - 1
  const trimester = month >= 8 ? 1 : month <= 2 ? 2 : 3

  return (
    <section className="grid min-h-screen grid-cols-[14rem_minmax(0,1fr)] bg-parchment max-[700px]:grid-cols-1">
      <aside className="flex flex-col gap-6 border-r border-stone bg-stone-light p-6 px-4 max-[700px]:gap-4 max-[700px]:p-4">
        <nav
          className="flex flex-col gap-[0.35rem] max-[700px]:flex-row max-[700px]:overflow-x-auto"
          aria-label="Gestion"
        >
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/planning/${tab.path}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[0.35rem] p-3 font-semibold no-underline ${
                  isActive
                    ? 'bg-castle text-parchment-light'
                    : 'text-castle hover:bg-castle hover:text-parchment-light'
                }`
              }
            >
              <FontAwesomeIcon icon={tab.icon} aria-hidden="true" />
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto grid gap-[0.3rem] rounded-[0.45rem] border border-stone bg-parchment p-4 text-[0.8rem] max-[700px]:mt-0">
          <span className="text-[0.65rem] text-stone-dark uppercase">Année scolaire</span>
          <strong className="font-title text-base">{schoolYearStart} — {schoolYearStart + 1}</strong>
          <span>{trimester === 1 ? '1er' : `${trimester}e`} trimestre</span>
        </div>
      </aside>

      <div className="min-w-0 p-10 max-[700px]:px-4 max-[700px]:py-6">
        <p className="m-0 mb-3 text-[0.7rem] font-bold tracking-[0.14em] text-brass-dark uppercase">
          Mon espace
        </p>
        <div className="min-h-[32rem] [&_h2]:m-0 [&_h2]:font-title [&_h3]:m-0 [&_h3]:font-title">
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export function PlanningHome() {
  return <Navigate to="/planning/edt" replace />
}
