import { useEffect, useState } from 'react'
import { StaffCard, PageTitle, Pagination, SearchBar } from '../components'
import { getStaffDirectory } from '../services'

// Nombre de cartes par page
const PER_PAGE = 6

export default function Staff() {
  const [staff, setStaff] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    getStaffDirectory()
      .then(setStaff)
      .catch(() => setError('Impossible de charger le staff. Le serveur est-il lancé (npm run server) ?'))
  }, [])

  const filteredStaff = staff.filter((wizard) => {
    const fullName = `${wizard.firstName} ${wizard.lastName}`.toLowerCase()
    return fullName.includes(search.trim().toLowerCase())
  })

  // Découpage de la liste filtrée en pages
  const totalPages = Math.ceil(filteredStaff.length / PER_PAGE)
  const pageStaff = filteredStaff.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Nouvelle recherche : on revient à la première page
  function handleSearch(value) {
    setSearch(value)
    setPage(1)
  }

  return (
    <section className="bg-texture-parchment flex flex-1 flex-col px-4 py-16">
      {/* flex-1 : la section remplit la hauteur disponible, le motif descend jusqu'au footer.
          mt-auto sur la pagination : elle est poussée en bas, juste au-dessus du footer */}
      <title>Le corps enseignant — Poudlard Emploi du temps</title>
      <div className="mx-auto flex w-full max-w-300 flex-1 flex-col">
        <PageTitle
          eyebrow="Annuaire"
          title="Le corps enseignant"
          subtitle="Celles et ceux qui transmettent leur savoir et font vivre Poudlard."
        />

        {/* w-full sur mobile, 2/3 de la largeur des cartes à partir de sm */}
        <div className="mx-auto mt-10 flex w-full flex-col gap-3 sm:w-2/3 sm:flex-row">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Rechercher un membre du staff…"
            className="flex-1"
          />
        </div>

        {error && <p className="mt-10 text-center text-error">{error}</p>}

        {!error && staff.length > 0 && filteredStaff.length === 0 && (
          <p className="mt-10 text-center text-stone-dark">Aucun membre du staff ne correspond à votre recherche.</p>
        )}

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pageStaff.map((wizard) => (
            <li key={wizard.id}>
              <StaffCard wizard={wizard} />
            </li>
          ))}
        </ul>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-auto pt-10" />
      </div>
    </section>
  )
}
