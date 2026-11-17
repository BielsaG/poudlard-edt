import { get } from './api'

const USER_KEY = 'poudlard-user'

export async function login(email, password) {
  const wizards = await get(
    `/wizards?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
  )

  if (wizards.length === 0) {
    throw new Error('Email ou mot de passe incorrect.')
  }

  const roles = await get('/roles')
  const wizard = wizards[0]
  const role = roles.find((item) => wizard.roleIds.includes(item.id))

  const user = {
    id: wizard.id,
    firstName: wizard.firstName,
    lastName: wizard.lastName,
    email: wizard.email,
    role: role?.label || 'Sorcier',
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event('auth-change'))

  return user
}

export function getCurrentUser() {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export function logout() {
  localStorage.removeItem(USER_KEY)
  window.dispatchEvent(new Event('auth-change'))
}
