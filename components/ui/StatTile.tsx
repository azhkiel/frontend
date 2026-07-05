interface StatTileProps {
  label: string;
  value: number | string;
  unit?: string;
  description?: string;
}

export default function StatTile({ label, value, unit, description }: StatTileProps) {
  return (
    <div className="bg-white border border-border rounded-lg p-5 text-center">
      <p className="font-body text-sm text-text-muted mb-1">{label}</p>
      <p className="tabular-nums font-heading font-bold text-3xl text-primary leading-none">
        {typeof value === "number" ? value.toLocaleString("id-ID") : value}
        {unit && <span className="text-base font-medium text-text-secondary ml-1">{unit}</span>}
      </p>
      {description && (
        <p className="mt-1 text-xs text-text-muted font-body">{description}</p>
      )}
    </div>
  );
}
