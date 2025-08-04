import { useMemo,useState } from 'react'

interface ColumnFilterProps<T> {
  columnKey: string
  data: T[]
  selectedValues: string[]
  onFilterChange: (values: string[]) => void
}

export function ColumnFilter<T extends Record<string, any>>({
  columnKey,
  data,
  selectedValues,
  onFilterChange,
}: ColumnFilterProps<T>) {
  const [isOpen, setIsOpen] = useState(false)

  const uniqueValues = useMemo(() => {
    const values = new Set<string>()
    data.forEach((row) => {
      values.add(String(row[columnKey]))
    })
    return Array.from(values).sort()
  }, [data, columnKey])

  const handleValueToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]

    onFilterChange(newValues)
  }

  const clearAll = () => onFilterChange([])
  const selectAll = () => onFilterChange(uniqueValues)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
      >
        Filter ({selectedValues.length})
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-10 mt-1 bg-white border rounded shadow-lg min-w-[200px] max-h-60 overflow-y-auto">
          <div className="p-2 border-b flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs px-2 py-1 bg-blue-100 rounded hover:bg-blue-200"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              Clear
            </button>
          </div>

          <div className="p-1">
            {uniqueValues.map((value) => (
              <label
                key={value}
                className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value)}
                  onChange={() => handleValueToggle(value)}
                  className="mr-2"
                />
                <span className="text-sm">{value}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
