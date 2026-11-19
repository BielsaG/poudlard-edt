import { useEffect, useState } from 'react'
import { List } from '../../components'
import { getCurrentUser } from '../../services/authService.js'
import { getClassById } from '../../services/classService.js'
import { getSubjects } from '../../services/subjectService.js'
import { getWizardById } from '../../services/wizardService.js'

export default function PlanningSubjects() {
  const [subjects, setSubjects] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadSubjects() {
    const user = getCurrentUser()
    if (!user) throw new Error('Vous devez être connecté pour voir vos matières.')

    const wizard = await getWizardById(user.id)
    if (!wizard.classId) throw new Error('Aucune classe associée à votre compte.')

    const studentClass = await getClassById(wizard.classId)
    const allSubjects = await getSubjects()
    const subjectIds = studentClass.subjectIds || []

    return allSubjects.filter(
      (subject) =>
        subjectIds.includes(subject.id) &&
        subject.levels.includes(studentClass.level),
    )
  }

  useEffect(() => {
    async function loadPage() {
      try {
        const subjectList = await loadSubjects()
        setSubjects(subjectList)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [])

  const query = search.trim().toLowerCase()
  const filteredSubjects = subjects.filter((subject) => {
    const teacher = subject.teacher
      ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
      : ''
    const text = `${subject.name} ${subject.room} ${teacher}`.toLowerCase()
    return text.includes(query)
  })

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2>Mes matières</h2>
      </div>

      {error && <p className="m-0 mb-4 text-error" role="alert">{error}</p>}

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <List
          columns={['Matière', 'Salle', 'Professeur']}
          search={search}
          onSearchChange={setSearch}
          placeholder="Rechercher dans mes matières..."
          actionsLabel={null}
          isEmpty={filteredSubjects.length === 0}
          emptyMessage={
            subjects.length === 0
              ? 'Aucune matière pour votre classe.'
              : 'Aucun résultat.'
          }
        >
          {filteredSubjects.map((subject) => (
            <tr
              key={subject.id}
            >
              <td>
                <span className="font-bold" style={{ color: subject.color }}>
                  {subject.name}
                </span>
              </td>
              <td>{subject.room}</td>
              <td>
                {subject.teacher
                  ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                  : 'Aucun professeur'}
              </td>
            </tr>
          ))}
        </List>
      )}
    </section>
  )
}
