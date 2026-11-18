const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options)

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} sur ${path}`)
  }

  return response.status === 204 ? null : response.json()
}

export const get = (path, options) => request(path, options)

function send(path, method, data) {
  return request(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export const post = (path, data) => send(path, 'POST', data)
export const patch = (path, data) => send(path, 'PATCH', data)
export const del = (path) => request(path, { method: 'DELETE' })
