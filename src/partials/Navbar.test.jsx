import { render, screen, within } from '@testing-library/react'
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

    // On cherche dans le bouton du profil (le nom apparaît aussi dans l'en-tête du menu)
    const profile = screen.getByRole('button', { name: /Albus Dumbledore/ })
    expect(within(profile).getByText('Albus Dumbledore')).toBeInTheDocument()
    expect(within(profile).getByText('AD')).toBeInTheDocument()
    expect(within(profile).getByText('Directeur')).toBeInTheDocument()
  })

  test('le menu du profil est fermé au départ', () => {
    renderNavbar({ user, onLogout: () => {} })

    expect(screen.getByRole('button', { name: /Albus Dumbledore/ })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: 'Mon profil' })).not.toBeInTheDocument()
  })

  test('cliquer sur le profil ouvre le menu : tableau de bord et fiche du sorcier', async () => {
    renderNavbar({ user, onLogout: () => {} })

    await userEvent.click(screen.getByRole('button', { name: /Albus Dumbledore/ }))

    expect(screen.getByRole('link', { name: 'Tableau de bord' })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('link', { name: 'Mon profil' })).toHaveAttribute('href', '/sorciers/3a8f')
  })

  test('un professeur est envoyé vers son planning', async () => {
    renderNavbar({ user: { ...user, role: 'Professeur' }, onLogout: () => {} })

    await userEvent.click(screen.getByRole('button', { name: /Albus Dumbledore/ }))

    expect(screen.getByRole('link', { name: 'Mon planning' })).toHaveAttribute('href', '/planning')
  })

  test('à la souris, le menu s’ouvre au survol et se ferme en sortant', async () => {
    renderNavbar({ user, onLogout: () => {} })
    const trigger = screen.getByRole('button', { name: /Albus Dumbledore/ })

    await userEvent.hover(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Mon profil' })).toBeInTheDocument()

    await userEvent.unhover(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('la touche Échap referme le menu', async () => {
    renderNavbar({ user, onLogout: () => {} })

    await userEvent.click(screen.getByRole('button', { name: /Albus Dumbledore/ }))
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('link', { name: 'Mon profil' })).not.toBeInTheDocument()
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
