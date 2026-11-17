const API_URL = import.meta.env.VITE_API_URL

export async function get(path) {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`Erreur ${res.status} sur ${path}`)
  return res.json()
}
