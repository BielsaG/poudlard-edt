const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(url, options) {
  const response = await fetch(API_URL + url, options)

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} sur ${url}`)
  }

  return response.status === 204 ? null : response.json()
}

export const get = (url, options) => request(url, options)

function send(url, method, data) {
  return request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export const post = (url, data) => send(url, 'POST', data)
export const patch = (url, data) => send(url, 'PATCH', data)
export const del = (url) => request(url, { method: 'DELETE' })
