import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function SearchBar({ value, onChange, placeholder = 'Rechercher…', label, className = '' }) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{label ?? placeholder}</span>
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-stone-dark"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-stone/60 bg-parchment-light py-2.5 pr-4 pl-10 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30"
      />
    </label>
  )
}
