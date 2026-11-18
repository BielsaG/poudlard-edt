// Ajoute des vérifications pratiques : toBeInTheDocument(), toHaveAttribute()...
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'node:util'

// React Router a besoin de TextEncoder, absent de l'environnement jsdom de Jest
globalThis.TextEncoder ??= TextEncoder
globalThis.TextDecoder ??= TextDecoder
