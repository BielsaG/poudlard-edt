import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlask, faHatWizard, faScroll } from '@fortawesome/free-solid-svg-icons'
import './admin.css'

const tabs = [
  { path: 'matieres', label: 'Matières', icon: faFlask },
  { path: 'eleves', label: 'Élèves', icon: faHatWizard },
  { path: 'classes', label: 'Classes', icon: faScroll },
]

export default function AdminLayout() {
  const today = new Date()
  const currentYear = today.getFullYear()
  const month = today.getMonth()
  const schoolYearStart = month >= 8 ? currentYear : currentYear - 1
  const trimester = month >= 8 ? 1 : month <= 2 ? 2 : 3

  return (
    <section className="admin-page">
      <aside className="admin-sidebar">
        <p className="admin-sidebar-label">Gestion de l'école</p>
        <nav className="admin-navigation" aria-label="Gestion">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/admin/${tab.path}`}
              className={({ isActive }) =>
                isActive ? 'admin-tab admin-tab-active' : 'admin-tab'
              }
            >
              <FontAwesomeIcon icon={tab.icon} aria-hidden="true" />
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-school-year">
          <span>Année scolaire</span>
          <strong>{schoolYearStart} — {schoolYearStart + 1}</strong>
          <span>{trimester === 1 ? '1er' : `${trimester}e`} trimestre</span>
        </div>
      </aside>

      <div className="admin-main">
        <p className="admin-eyebrow">Administration</p>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export function AdminHome() {
  return <Navigate to="/admin/matieres" replace />
}
