import { del, get, patch, post } from './api'

function formatLevels(levels) {
  if (levels.length === 0) return '—'
  if (levels.length === 1) return `${levels[0]}`

  const first = levels[0]
  const last = levels[levels.length - 1]
  const isFollowing = last - first === levels.length - 1 // pas de trou dans la liste
  if (isFollowing) return `${first} à ${last}`

  return `${levels.slice(0, -1).join(', ')} et ${last}`
}

// Classes qui ont cette matière dans leur programme, de la 1re à la 6e année
function getSubjectClasses(subjectId, classes) {
  return classes.filter((c) => c.subjectIds.includes(subjectId)).sort((a, b) => a.level - b.level)
}

// Une matière par son id
export const getSubjectById = (id) => get(`/subjects/${id}`)
export const createSubject = (subject) => post('/subjects', subject)
export const updateSubject = (id, subject) =>
  patch(`/subjects/${encodeURIComponent(id)}`, subject)
export const deleteSubject = (id) => del(`/subjects/${encodeURIComponent(id)}`)

// Toutes les matières avec leur professeur et les niveaux où elles sont enseignées
// (json-server ne sait pas faire ces jointures : on les fait ici)
export async function getSubjects() {
  const [subjects, staff, classes] = await Promise.all([
    get('/subjects'),
    get('/wizards?houseId=null'),
    get('/classes'),
  ])

  return subjects.map((subject) => {
    const levels = getSubjectClasses(subject.id, classes).map((c) => c.level)

    return {
      ...subject,
      teacher: staff.find((w) => w.id === subject.teacherId) ?? null,
      levels,
      levelsLabel: formatLevels(levels),
    }
  })
}
