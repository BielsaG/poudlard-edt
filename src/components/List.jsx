import SearchBar from './SearchBar'

export default function List({
  columns,
  search,
  onSearchChange,
  placeholder,
  isEmpty,
  emptyMessage,
  actionsLabel = 'Actions',
  children,
}) {
  return (
    <div className="data-list overflow-hidden rounded-lg border border-stone bg-parchment-light shadow-[0_0.4rem_1rem_rgb(42_36_32_/_5%)]">
      <div className="data-list-search border-b border-stone p-4">
        <SearchBar value={search} onChange={onSearchChange} placeholder={placeholder} />
      </div>
      <div className="data-list-scroll overflow-x-auto">
        <table className="data-list-table w-full min-w-[38rem] border-collapse [&_th]:bg-stone-light [&_th]:p-4 [&_th]:text-left [&_th]:text-[0.7rem] [&_th]:tracking-[0.08em] [&_th]:text-stone-dark [&_th]:uppercase [&_td]:border-t [&_td]:border-stone-light [&_td]:p-4 [&_td]:text-left [&_tbody>tr:first-child>td]:border-t-0 [&_td.data-list-empty]:px-4 [&_td.data-list-empty]:py-8 [&_td.data-list-empty]:text-center [&_td.data-list-empty]:text-stone-dark [&_td.data-list-actions-cell]:text-right [&_th.data-list-actions-heading]:text-right">
          <thead>
            <tr>
              {columns.map((column) => <th key={column}>{column}</th>)}
              {actionsLabel && (
                <th className="data-list-actions-heading">{actionsLabel}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td
                  className="data-list-empty"
                  colSpan={columns.length + (actionsLabel ? 1 : 0)}
                >
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
