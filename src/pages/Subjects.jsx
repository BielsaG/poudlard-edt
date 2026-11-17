import { useEffect, useState } from 'react'
import { PageTitle, SubjectCard } from '../components'
import { getSubjects } from '../services'

export default function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    getSubjects()
      .then(setSubjects)
      .catch(() => setError('Impossible de charger les matières. Le serveur est-il lancé (npm run server) ?'))
  }, [])

  return (
    <section className="bg-texture-parchment px-4 py-16">
      <div className="mx-auto max-w-300">
        <PageTitle
          eyebrow="Programme scolaire"
          title="Les matières enseignées"
          subtitle="Un enseignement magique complet, de la première à la sixième année."
        />

        {error && <p className="mt-10 text-center text-error">{error}</p>}

        <ul className="mt-10 flex flex-col gap-3">
          {subjects.map((subject) => (
            <li key={subject.id}>
              <SubjectCard subject={subject} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
