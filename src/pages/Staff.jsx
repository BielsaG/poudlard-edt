import { useEffect, useState } from 'react'
import { StaffCard, PageTitle, SearchBar } from '../components'
import { getStaffDirectory } from '../services'

export default function Staff() {
  const [staff, setStaff] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getStaffDirectory()
      .then(setStaff)
      .catch(() => setError('Impossible de charger le staff. Le serveur est-il lancé (npm run server) ?'))
  }, [])

  // Liste filtrée par la recherche (sur le prénom et le nom)
  const filteredStaff = staff.filter((wizard) => {
    const fullName = `${wizard.firstName} ${wizard.lastName}`.toLowerCase()
    return fullName.includes(search.trim().toLowerCase())
  })

  return (
    <section className="bg-texture-parchment px-4 py-16">
      <title>Le corps enseignant — Poudlard's Timetable</title>
      <div className="mx-auto max-w-300">
        <PageTitle
          eyebrow="Annuaire"
          title="Le corps enseignant"
          subtitle="Celles et ceux qui transmettent leur savoir et font vivre Poudlard."
        />

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher un membre du staff…"
            className="flex-1"
          />
        </div>

        {error && <p className="mt-10 text-center text-error">{error}</p>}

        {!error && staff.length > 0 && filteredStaff.length === 0 && (
          <p className="mt-10 text-center text-stone-dark">Aucun membre du staff ne correspond à votre recherche.</p>
        )}

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((wizard) => (
            <li key={wizard.id}>
              <StaffCard wizard={wizard} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
