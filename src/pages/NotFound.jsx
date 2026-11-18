import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section>
      <title>Page introuvable — Poudlard Emploi du temps</title>
      <meta name="robots" content="noindex" />
      <h1>404</h1>
      <p>Cette page a disparu, comme par magie.</p>
      <Link to="/">Retour à l'accueil</Link>
    </section>
  )
}
