import type { KategoriBerita, KategoriPotensi } from "@/lib/types";

type BadgeVariant = KategoriBerita | KategoriPotensi | "foto" | "video";

const STYLES: Record<string, string> = {
  Pengumuman:      "bg-blue-50 text-blue-800 border border-blue-200",
  Kegiatan:        "bg-primary-50 text-primary border border-primary-100",
  Pembangunan:     "bg-amber-50 text-amber-800 border border-amber-200",
  Lainnya:         "bg-gray-100 text-gray-700 border border-gray-200",
  UMKM:            "bg-primary-50 text-primary border border-primary-100",
  Wisata:          "bg-teal-50 text-teal-800 border border-teal-200",
  "Produk Unggulan":"bg-accent/10 text-amber-800 border border-accent/30",
  foto:            "bg-gray-100 text-gray-700 border border-gray-200",
  video:           "bg-red-50 text-red-700 border border-red-200",
};

interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
}

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`badge ${STYLES[variant] ?? STYLES.Lainnya}`}>
      {children ?? variant}
    </span>
  );
}
