// Sur-titre en majuscules espacées (ex. "LES QUATRE MAISONS")
export default function Eyebrow({ children, className = 'text-brass-dark' }) {
  return <p className={`text-xs font-bold tracking-[0.2em] uppercase ${className}`}>{children}</p>
}
