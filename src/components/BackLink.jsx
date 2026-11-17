import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

// Lien de retour avec une flèche : <BackLink to="/matieres">Toutes les matières</BackLink>
export default function BackLink({ to, children }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 font-bold text-brass-dark hover:underline">
      <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
      {children}
    </Link>
  )
}
