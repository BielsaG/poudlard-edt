import SearchBar from './SearchBar'
import './List.css'

export default function List({
  columns,
  search,
  onSearchChange,
  placeholder,
  isEmpty,
  emptyMessage,
  children,
}) {
  return (
    <div className="data-list">
      <div className="data-list-search">
        <SearchBar value={search} onChange={onSearchChange} placeholder={placeholder} />
      </div>
      <div className="data-list-scroll">
        <table className="data-list-table">
          <thead>
            <tr>
              {columns.map((column) => <th key={column}>{column}</th>)}
              <th className="data-list-actions-heading">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td className="data-list-empty" colSpan={columns.length + 1}>
                  {emptyMessage}
                </td>
              </tr>
            ) : children}
          </tbody>
        </table>
      </div>
    </div>
  )
}
