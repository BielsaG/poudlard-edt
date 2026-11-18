import { get, post } from './api'

const USER_KEY = 'poudlard'

export async function login(email, password) {
  const wizard = await post('/login', { email, password })

  if (!wizard) {
    throw new Error('Email ou mot de passe incorrect.')
  }

  const roles = await get('/roles')
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
