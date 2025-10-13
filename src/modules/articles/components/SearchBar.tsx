type Props = {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="searchbar">
      <input
        placeholder="Buscar artículos"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="buscar"
      />
      {value && (
        <button onClick={() => onChange('')} aria-label="clear">
          Limpiar
        </button>
      )}
    </div>
  )
}
