import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import img from '../assets/photos/photo-poudlard-accueil.jpg'
import { getHouses, getSubjects, getTeachers } from '../services'
import { 
  Avatar, 
  Eyebrow, 
  HouseCard 
} from '../components'

const TEACHERS_PREVIEW = 3
const SUBJECTS_PREVIEW = 3

export default function Home() {
  const [houses, setHouses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getHouses(), getTeachers(), getSubjects()])
      .then(([housesData, teachersData, subjectsData]) => {
        setHouses(housesData)
        setTeachers(teachersData.slice(0, TEACHERS_PREVIEW))
        setSubjects(subjectsData.slice(0, SUBJECTS_PREVIEW))
      })
      .catch(() => setError('Impossible de charger les données. Le serveur est-il lancé (npm run server) ?'))
  }, [])

  return (
    <>
      {/* React 19 place ces balises dans le <head> de la page */}
      <title>Poudlard Emploi du temps — Les emplois du temps de l'école de sorcellerie</title>
      <section className="relative isolate flex min-h-[38rem] items-center overflow-hidden">
        <img src={img} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-castle/95 via-castle/80 to-castle/50" />

        <div className="mx-auto w-full max-w-360 px-4 py-16 md:px-29">
          <p className="text-xs font-bold tracking-[0.2em] text-brass-light uppercase">
            École de sorcellerie
          </p>

          <h1 className="mt-5 font-title text-4xl leading-tight text-parchment md:text-5xl">
            Votre année à Poudlard,
            <span className="block text-brass-light">parfaitement orchestrée.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-light">
            Consultez les cours, découvrez les enseignants et les dernières infos de la vie au château.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/connexion"
              className="rounded-md border border-brass bg-brass px-5 py-2.5 font-bold text-parchment transition-colors hover:border-brass-light hover:bg-brass-light hover:text-castle"
            >
              Se connecter
            </Link>
            <Link
              to="/matieres"
              className="flex items-center gap-2 rounded-md border border-stone/60 px-5 py-2.5 font-bold text-parchment transition-colors hover:border-parchment hover:bg-parchment hover:text-castle"
            >
              Voir les matières
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-texture-parchment px-4 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <Eyebrow className="text-brass-dark">Les quatre maisons</Eyebrow>
          <h2 className="mt-3 font-title text-3xl md:text-4xl">Un château, quatre histoires</h2>
        </div>

        {error && <p className="mt-10 text-center text-error">{error}</p>}

        <ul className="mx-auto mt-12 grid max-w-300 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {houses.map((house) => (
            <HouseCard key={house.id} house={house} />
          ))}
        </ul>
      </section>

      <section className="bg-stone-light px-4 py-20 md:py-24">
        <div className="mx-auto grid max-w-300 items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow className="text-brass-dark">Le corps enseignant</Eyebrow>
            <h2 className="mt-3 font-title text-3xl md:text-4xl">Guidés par les meilleurs</h2>
            <Link to="/staff" className="mt-6 inline-flex items-center gap-2 font-bold text-brass-dark hover:underline">
              Découvrir tout le staff
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </Link>
          </div>

          <ul className="flex flex-col gap-3">
            {teachers.map((teacher) => (
              <li key={teacher.id}>
                <Link
                  to={`/sorciers/${teacher.id}`}
                  className="group flex items-center gap-4 rounded-md bg-parchment-light px-4 py-4 shadow-xl transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brass/25"
                >
                  <Avatar firstName={teacher.firstName} lastName={teacher.lastName} />
                  <span className="flex flex-col">
                    <span className="font-bold">
                      {teacher.firstName} {teacher.lastName}
                    </span>
                    <span className="text-sm text-stone-dark">{teacher.subject.name}</span>
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="ml-auto text-sm text-stone-dark transition group-hover:translate-x-1 group-hover:text-brass-dark"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-texture-parchment px-4 py-20 md:py-24">
        <div className="mx-auto max-w-300">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow className="text-brass-dark">Enseignements</Eyebrow>
              <h2 className="mt-3 font-title text-3xl md:text-4xl">Les matières à l'honneur</h2>
            </div>
            <Link to="/matieres" className="inline-flex items-center gap-2 font-bold text-brass-dark hover:underline">
              Toutes les matières
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </Link>
          </div>

          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {subjects.map((subject) => (
              <li key={subject.id} className="flex gap-4 rounded-md bg-parchment-light p-6 shadow-xl">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-stone-light font-title font-bold text-stone-dark">
                  {subject.name[0]}
                </span>
                <div className="min-w-0">
                  <h3 className="font-title text-xl">{subject.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-stone-dark">
                    <FontAwesomeIcon icon={faLocationDot} className="shrink-0 text-sm" />
                    {subject.room}
                  </p>
                  {subject.teacher && (
                    <p className="mt-2 text-sm text-stone-dark">
                      {subject.teacher.firstName} {subject.teacher.lastName}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
