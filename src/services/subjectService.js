import { del, get, patch, post } from './api'

function formatLevels(levels) {
  if (levels.length === 0) return '—'
  if (levels.length === 1) return `${levels[0]}`

  const first = levels[0]
  const last = levels[levels.length - 1]
  const isFollowing = last - first === levels.length - 1 
  if (isFollowing) return `${first} à ${last}`

  return `${levels.slice(0, -1).join(', ')} et ${last}`
}

function getSubjectClasses(subjectId, classes) {
  return classes.filter((c) => c.subjectIds.includes(subjectId)).sort((a, b) => a.level - b.level)
}

export const getSubjectById = (id) => get(`/subjects/${id}`)
export const createSubject = (subject) => post('/subjects', subject)
export const updateSubject = (id, subject) =>
  patch(`/subjects/${encodeURIComponent(id)}`, subject)
export const deleteSubject = (id) => del(`/subjects/${encodeURIComponent(id)}`)

export async function getSubjects() {
  const subjects = await get('/subjects')
  const staff = await get('/wizards?houseId=null')
  const classes = await get('/classes')

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
