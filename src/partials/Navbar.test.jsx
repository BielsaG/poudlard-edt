import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

function renderNavbar(props, url = '/') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Navbar {...props} />
    </MemoryRouter>,
  )
}

const user = { id: '3a8f', firstName: 'Albus', lastName: 'Dumbledore', role: 'Directeur' }

describe('Navbar — visiteur (pas connecté)', () => {
  test('affiche le bouton « Se connecter » vers /connexion', () => {
    renderNavbar({ user: null })

    expect(screen.getByRole('link', { name: 'Se connecter' })).toHaveAttribute('href', '/connexion')
  })

  test('n’affiche pas le bouton de déconnexion', () => {
    renderNavbar({ user: null })

    expect(screen.queryByRole('button', { name: 'Se déconnecter' })).not.toBeInTheDocument()
  })

  test('marque le lien de la page actuelle comme actif', () => {
    renderNavbar({ user: null }, '/staff')

    expect(screen.getByRole('link', { name: 'Le staff' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Accueil' })).not.toHaveAttribute('aria-current')
  })
})

describe('Navbar — utilisateur connecté', () => {
  test('affiche le nom, les initiales et le rôle', () => {
    renderNavbar({ user, onLogout: () => {} })

    expect(screen.getByText('Albus Dumbledore')).toBeInTheDocument()
    expect(screen.getByText('AD')).toBeInTheDocument()
    expect(screen.getByText('Directeur')).toBeInTheDocument()
  })

  test('le profil mène vers la fiche du sorcier', () => {
    renderNavbar({ user, onLogout: () => {} })

    expect(screen.getByRole('link', { name: /Albus Dumbledore/ })).toHaveAttribute('href', '/sorciers/3a8f')
  })

  test('n’affiche plus le bouton « Se connecter »', () => {
    renderNavbar({ user, onLogout: () => {} })

    expect(screen.queryByRole('link', { name: 'Se connecter' })).not.toBeInTheDocument()
  })

  test('le bouton de déconnexion appelle onLogout puis onNavigate', async () => {
    const onLogout = jest.fn()
    const onNavigate = jest.fn()
    renderNavbar({ user, onLogout, onNavigate })

    await userEvent.click(screen.getByRole('button', { name: 'Se déconnecter' }))

    expect(onLogout).toHaveBeenCalledTimes(1)
    expect(onNavigate).toHaveBeenCalledTimes(1)
  })
})
