import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { Label, PageTitle, SubjectInitial } from '../components'
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
            <li
              key={subject.id}
              className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-md border border-stone/60 bg-parchment-light px-5 py-5"
            >
              {/* Initiale + nom + professeur */}
              <div className="flex min-w-60 flex-1 items-center gap-5">
                <SubjectInitial name={subject.name} />
                <div>
                  <h2 className="font-title text-xl">{subject.name}</h2>
                  <p className="text-stone-dark">
                    {subject.teacher ? `${subject.teacher.firstName} ${subject.teacher.lastName}` : 'Aucun professeur'}
                  </p>
                </div>
              </div>

              {/* Salle */}
              <div className="w-56">
                <Label>Salle dédiée</Label>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-bold">
                  <FontAwesomeIcon icon={faLocationDot} className="text-stone-dark" />
                  {subject.room}
                </p>
              </div>

              {/* Niveaux */}
              <div className="w-28">
                <Label>Niveaux</Label>
                <p className="mt-1 text-sm font-bold">{subject.levelsLabel}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
