import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import { Eyebrow } from '../components'

export default function NotFound() {
  return (
    <section className="bg-texture-parchment flex min-h-[70vh] items-center justify-center px-4 py-16">
      <title>Page introuvable — Poudlard Emploi du temps</title>
      <meta name="robots" content="noindex" />

      <div className="w-full max-w-lg rounded-2xl border border-stone-light bg-parchment-light p-10 text-center shadow-sm">
        <FontAwesomeIcon icon={faWandMagicSparkles} className="text-3xl text-brass" />

        <h1 className="mt-4 font-title text-7xl font-bold text-castle">404</h1>

        <Eyebrow className="mt-2 text-brass-dark">Page introuvable</Eyebrow>

        <p className="mt-5 text-lg leading-relaxed text-stone-dark">
          Cette page a disparu, comme par magie.
          <span className="block">Même la Carte du Maraudeur ne la trouve pas.</span>
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-brass bg-brass px-5 py-2.5 font-bold text-parchment transition-colors hover:border-brass-light hover:bg-brass-light hover:text-castle"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          Retour à l'accueil
        </Link>
      </div>
    </section>
  )
}
