import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  test('affiche le placeholder et la valeur reçue', () => {
    render(<SearchBar value="Rogue" onChange={() => {}} placeholder="Rechercher un membre du staff…" />)

    const input = screen.getByRole('searchbox')
    expect(input).toHaveAttribute('placeholder', 'Rechercher un membre du staff…')
    expect(input).toHaveValue('Rogue')
  })

  test('utilise le placeholder par défaut', () => {
    render(<SearchBar value="" onChange={() => {}} />)

    expect(screen.getByRole('searchbox')).toHaveAttribute('placeholder', 'Rechercher…')
  })

  test('appelle onChange avec le texte tapé (et pas l’événement)', async () => {
    const onChange = jest.fn()
    render(<SearchBar value="" onChange={onChange} />)

    await userEvent.type(screen.getByRole('searchbox'), 'a')

    expect(onChange).toHaveBeenCalledWith('a')
  })

  test('est accessible grâce à son libellé', () => {
    render(<SearchBar value="" onChange={() => {}} label="Rechercher une matière" />)

    // getByLabelText échoue si le champ n'est pas relié à un libellé
    expect(screen.getByLabelText('Rechercher une matière')).toBeInTheDocument()
  })
})
