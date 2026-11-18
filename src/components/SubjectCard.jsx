import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import Label from './Label'
import SubjectInitial from './SubjectInitial'

// Ligne d'une matière : initiale, nom, professeur, salle et niveaux
// subject : une matière avec "teacher" et "levelsLabel" (voir getSubjects)
export default function SubjectCard({ subject }) {
  const teacherName = subject.teacher
    ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
    : 'Aucun professeur'

  return (
    <article className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-md border border-stone/60 bg-parchment-light px-5 py-5">
      {/* Initiale + nom + professeur */}
      <div className="flex min-w-60 flex-1 items-center gap-5">
        <SubjectInitial name={subject.name} />
        <div>
          <h2 className="font-title text-xl">{subject.name}</h2>
          <p className="text-stone-dark">{teacherName}</p>
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
    </article>
  )
}
