export function LoadingState({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Memuat data...">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-0 overflow-hidden">
          <div className="skeleton h-48 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-5 w-5/6 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-4/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ message = "Belum ada data tersedia." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center" role="status">
      <svg className="w-14 h-14 text-primary-100 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="font-body font-semibold text-text-secondary text-lg">{message}</p>
      <p className="text-text-muted text-sm mt-1">Silakan cek kembali nanti.</p>
    </div>
  );
}
