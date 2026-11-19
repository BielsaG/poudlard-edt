import { del, get, patch, post } from './api'
import { getRoles } from './roleService'

export const getWizards = () => get('/wizards')

export const getWizardById = (id) => get(`/wizards/${id}`)

export const updateWizard = (id, wizard) =>
  patch(`/wizards/${id}`, wizard)

export const deleteWizard = (id) => del(`/wizards/${id}`)

export const createWizard = (wizard) =>
  post('/wizards', wizard)

export async function getWizardProfile(id) {
  const wizard = await getWizardById(id)
  const roles = await get('/roles')
  const houses = await get('/houses')
  const classes = await get('/classes')

  return {
    id: wizard.id,
    prenom: wizard.firstName,
    nom: wizard.lastName,
    email: wizard.email,
    photo: wizard.avatar,
    roles: (wizard.roleIds || []).map((roleId) => roles.find((role) => role.id === roleId)?.label || roleId),
    maison: houses.find((house) => house.id === wizard.houseId)?.name || '',
    classe: classes.find((classe) => classe.id === wizard.classId)?.name || '',
    houseId: wizard.houseId || '',
    classId: wizard.classId || '',
    maisons: houses,
    classes,
    villeOrigine: wizard.villeOrigine || '',
    animal: wizard.animal || '',
    baguette: wizard.baguette || {},
  }
}

export async function getStudents() {
  const wizards = await getWizards()
  const roles = await getRoles()
  const studentRole = roles.find((role) => role.name === 'user')

  if (!studentRole) throw new Error('Le rôle élève est introuvable.')

  return wizards.filter((wizard) => wizard.roleIds.includes(studentRole.id))
}

export async function createStudent(student) {
  const roles = await getRoles()
  const studentRole = roles.find((role) => role.name === 'user')

  if (!studentRole) throw new Error('Le rôle élève est introuvable.')

  return post('/wizards', {
    ...student,
    avatar: '',
    headOfHouseId: null,
    roleIds: [studentRole.id],
  })
}

export const getStaff = () => get('/wizards?houseId=null')

export async function getTeachers() {
  const staff = await getStaff()
  const subjects = await get('/subjects')

  return staff.map((wizard) => ({ ...wizard, subject: subjects.find((subject) => subject.teacherId === wizard.id) || null })).filter((wizard) => wizard.subject)
}

export async function getStaffDirectory() {
  const staff = await get('/wizards?houseId=null&_sort=lastName')
  const roles = await get('/roles')
  const subjects = await get('/subjects')

  return staff.map((wizard) => ({ ...wizard, roles: roles.filter((role) => wizard.roleIds.includes(role.id)), subjects: subjects.filter((subject) => subject.teacherId === wizard.id) }))
}
