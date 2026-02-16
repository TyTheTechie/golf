interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
}

export default function DataTable<T>({ columns, data, keyField }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        No records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-card-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-3 px-4 font-medium text-muted"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={String(row[keyField])}
              className="border-b border-card-border/50 hover:bg-muted-bg/50"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4 text-foreground">
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
