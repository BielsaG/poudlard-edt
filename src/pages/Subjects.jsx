import { useEffect, useState } from 'react'
import { PageTitle, SearchBar, SubjectCard } from '../components'
import { getSubjects } from '../services'

export default function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getSubjects()
      .then(setSubjects)
      .catch(() => setError('Impossible de charger les matières. Le serveur est-il lancé (npm run server) ?'))
  }, [])

  // Matières dont le nom, le professeur ou la salle contient le texte recherché
  const query = search.trim().toLowerCase()
  const filteredSubjects = subjects.filter((subject) => {
    const teacher = subject.teacher ? `${subject.teacher.firstName} ${subject.teacher.lastName}` : ''
    const text = `${subject.name} ${teacher} ${subject.room}`.toLowerCase()
    return text.includes(query)
  })

  return (
    <section className="bg-texture-parchment px-4 py-16">
      <title>Les matières enseignées — Poudlard's Timetable</title>
      <div className="mx-auto max-w-300">
        <PageTitle
          eyebrow="Programme scolaire"
          title="Les matières enseignées"
          subtitle="Un enseignement magique complet, de la première à la sixième année."
        />

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Rechercher une matière, un professeur, une salle…"
          className="mx-auto mt-10 max-w-3xl"
        />

        {error && <p className="mt-10 text-center text-error">{error}</p>}

        {!error && subjects.length > 0 && filteredSubjects.length === 0 && (
          <p className="mt-10 text-center text-stone-dark">Aucune matière ne correspond à votre recherche.</p>
        )}

        <ul className="mt-10 flex flex-col gap-3">
          {filteredSubjects.map((subject) => (
            <li key={subject.id}>
              <SubjectCard subject={subject} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
