import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// getCurrentUser() lit l'utilisateur connecté dans le localStorage (clé "poudlard")
function loginAs(role) {
  localStorage.setItem('poudlard', JSON.stringify({ id: '1', firstName: 'Test', lastName: 'Test', role }))
}

// Mini-application : une page /admin protégée, et les pages de redirection
function renderAt(url, role) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/" element={<p>Accueil</p>} />
        <Route path="/connexion" element={<p>Connexion</p>} />
        <Route element={<ProtectedRoute role={role} />}>
          <Route path="/protegee" element={<p>Page protégée</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  afterEach(() => localStorage.clear())

  test('pas connecté : redirige vers la connexion', () => {
    renderAt('/protegee')
    expect(screen.getByText('Connexion')).toBeInTheDocument()
    expect(screen.queryByText('Page protégée')).not.toBeInTheDocument()
  })

  test('connecté, sans rôle exigé : affiche la page', () => {
    loginAs('Élève')
    renderAt('/protegee')
    expect(screen.getByText('Page protégée')).toBeInTheDocument()
  })

  test('connecté avec le bon rôle : affiche la page', () => {
    loginAs('Directeur')
    renderAt('/protegee', 'Directeur')
    expect(screen.getByText('Page protégée')).toBeInTheDocument()
  })

  test('connecté avec un autre rôle : redirige vers l’accueil', () => {
    loginAs('Élève')
    renderAt('/protegee', 'Directeur')
    expect(screen.getByText('Accueil')).toBeInTheDocument()
    expect(screen.queryByText('Page protégée')).not.toBeInTheDocument()
  })
})
