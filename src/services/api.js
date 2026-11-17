const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function get(path, options) {
  const res = await fetch(`${API_URL}${path}`, options)
  if (!res.ok) throw new Error(`Erreur ${res.status} sur ${path}`)
  return res.status === 204 ? null : res.json()
}
