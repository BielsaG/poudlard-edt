import { useEffect, useState } from 'react'
import { Card } from '../../components'
import { getCurrentUser } from '../../services/authService.js'
import { getSubjects } from '../../services/subjectService.js'
import { getClassTimeslots } from '../../services/timeslotService.js'
import { getWizardById } from '../../services/wizardService.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'

const days = [
  { value: 'lundi', label: 'Lundi' },
  { value: 'mardi', label: 'Mardi' },
  { value: 'mercredi', label: 'Mercredi' },
  { value: 'jeudi', label: 'Jeudi' },
  { value: 'vendredi', label: 'Vendredi' },
]

export default function PlanningEdt() {
  const [timeslots, setTimeslots] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadTimetable() {
    const user = getCurrentUser()
    if (!user) throw new Error('Vous devez être connecté pour voir votre emploi du temps.')

    const wizard = await getWizardById(user.id)
    if (!wizard.classId) throw new Error('Aucune classe associée à votre compte.')

    const classTimeslots = await getClassTimeslots(wizard.classId)
    const subjectList = await getSubjects()

    return { classTimeslots, subjectList }
  }

  useEffect(() => {
    async function loadPage() {
      try {
        const { classTimeslots, subjectList } = await loadTimetable()
        setTimeslots(classTimeslots)
        setSubjects(subjectList)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [])

  const hours = [...new Set(timeslots.map((slot) => `${slot.start}|${slot.end}`))]
    .sort()

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="m-0 font-title">Mon emploi du temps</h2>
      </div>

      {loading ? (
        <p>Chargement…</p>
      ) : error ? (
        <p className="mb-4 text-error" role="alert">{error}</p>
      ) : timeslots.length === 0 ? (
        <p>Aucun cours pour votre classe.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed border-collapse">
            <thead>
              <tr>
                <th className="border border-stone bg-stone-light p-[0.6rem] text-center" scope="col">Heure</th>
                {days.map((day) => (
                  <th
                    className="border border-stone bg-stone-light p-[0.6rem] text-center"
                    scope="col"
                    key={day.value}
                  >
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => {
                const [start, end] = hour.split('|')

                return (
                  <tr key={hour}>
                    <th
                      scope="row"
                      className="w-[7.5rem] whitespace-nowrap border border-stone bg-stone-light p-[0.6rem]"
                    >
                      {start} – {end}
                    </th>
                    {days.map((day) => {
                      const timeslot = timeslots.find(
                        (slot) =>
                          slot.day === day.value &&
                          slot.start === start &&
                          slot.end === end,
                      )
                      const subject = subjects.find(
                        (item) => item.id === timeslot?.subjectId,
                      )

                      return (
                        <td
                          key={day.value}
                          className="h-36 align-top border border-stone p-[0.6rem]"
                        >
                          {subject && (
                            <div
                              className="w-full [&_.rounded-md]:flex [&_.rounded-md]:h-32 [&_.rounded-md]:w-full [&_.rounded-md]:min-w-0 [&_.rounded-md]:flex-col [&_.rounded-md]:overflow-hidden [&_.rounded-md]:!p-3 [&_.rounded-md]:!shadow-xl [&_.rounded-md]:!shadow-(color:--subject-color)/20 [&_.rounded-md>h2]:!text-base [&_.rounded-md>h2]:line-clamp-2 [&_.rounded-md>hr]:!my-2 [&_.rounded-md>div]:mt-auto"
                              style={{ '--subject-color': subject.color }}
                            >
                              <Card
                                title={
                                  <span style={{ color: subject.color }}>
                                    {subject.name}
                                  </span>
                                }
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold text-stone-dark">
                                    {subject.teacher
                                      ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                                      : 'Aucun professeur'}
                                  </p>
                                  <p className="mt-1 truncate text-[0.7rem] text-stone">
                                    <FontAwesomeIcon icon={faLocationDot} className="shrink-0 text-sm" />
                                    {subject.room}
                                  </p>
                                </div>
                              </Card>
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
