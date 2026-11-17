import { get } from './api'

// Une matière par son id
export const getSubjectById = (id) => get(`/subjects/${id}`)

// Toutes les matières avec leur professeur
// (json-server ne sait pas relier subjects.teacherId à wizards : on le fait ici)
export async function getSubjects() {
  const [subjects, staff] = await Promise.all([get('/subjects'), get('/wizards?houseId=null')])

  return subjects.map((subject) => ({
    ...subject,
    teacher: staff.find((w) => w.id === subject.teacherId) ?? null,
  }))
}
