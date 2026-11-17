import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Avatar, Label, PageTitle } from '../components'
import { getStaffDirectory } from '../services'

const fieldClass =
  'rounded-md border border-stone/60 bg-parchment-light px-4 py-2.5 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30'

export default function Staff() {
  const [staff, setStaff] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [roleId, setRoleId] = useState('')

  useEffect(() => {
    getStaffDirectory()
      .then(setStaff)
      .catch(() => setError('Impossible de charger le staff. Le serveur est-il lancé (npm run server) ?'))
  }, [])

  // Rôles présents dans le staff, sans doublon (pour le menu déroulant)
  const roles = []
  staff.forEach((wizard) =>
    wizard.roles.forEach((role) => {
      if (!roles.some((r) => r.id === role.id)) roles.push(role)
    }),
  )

  // Liste filtrée par la recherche et par le rôle choisi
  const filteredStaff = staff.filter((wizard) => {
    const fullName = `${wizard.firstName} ${wizard.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(search.trim().toLowerCase())
    const matchesRole = roleId === '' || wizard.roleIds.includes(roleId)
    return matchesSearch && matchesRole
  })

  return (
    <section className="bg-texture-parchment px-4 py-16">
      <div className="mx-auto max-w-300">
        <PageTitle
          eyebrow="Annuaire"
          title="Le corps enseignant"
          subtitle="Celles et ceux qui transmettent leur savoir et font vivre Poudlard."
        />

        {/* Recherche + filtre */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Rechercher un membre du staff</span>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-stone-dark"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un membre du staff…"
              className={`${fieldClass} w-full pl-10`}
            />
          </label>
        </div>

        {error && <p className="mt-10 text-center text-error">{error}</p>}

        {!error && staff.length > 0 && filteredStaff.length === 0 && (
          <p className="mt-10 text-center text-stone-dark">Aucun membre du staff ne correspond à votre recherche.</p>
        )}

        {/* Cartes */}
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((wizard) => (
            <li
              key={wizard.id}
              className="flex gap-5 rounded-md border border-stone/60 bg-parchment-light p-7 shadow-md shadow-castle/5"
            >
              <Avatar
                firstName={wizard.firstName}
                lastName={wizard.lastName}
                className="size-18 bg-stone/60 font-title text-2xl text-castle shadow-md"
              />

              <div className="min-w-0 flex-1">
                <h2 className="font-title text-xl">
                  {wizard.firstName} {wizard.lastName}
                </h2>

                <hr className="my-4 border-stone/50" />

                <Label>Matière enseignée</Label>
                <p className="mt-1 font-bold">
                  {wizard.subjects.length > 0 ? wizard.subjects.map((s) => s.name).join(', ') : '—'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
