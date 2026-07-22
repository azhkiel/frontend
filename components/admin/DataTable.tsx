"use client";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = "Belum ada data.",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="admin-table-wrap">
        <div className="admin-table-loading">
          <div className="admin-spinner" />
          <span>Memuat data...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="admin-table-wrap">
        <div className="admin-table-empty">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="admin-th">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="admin-th admin-th--actions">Aksi</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="admin-tr">
              {columns.map((col) => (
                <td key={String(col.key)} className="admin-td">
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[String(col.key)] ?? "-")}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="admin-td admin-td--actions">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="admin-action-btn admin-action-btn--edit"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="admin-action-btn admin-action-btn--delete"
                    >
                      Hapus
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
