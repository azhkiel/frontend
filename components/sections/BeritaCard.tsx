import Link from "next/link";
import Image from "next/image";
import type { Berita } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface BeritaCardProps {
  berita: Berita;
  featured?: boolean;
}

function formatTanggal(tanggal: string) {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BeritaCard({ berita, featured = false }: BeritaCardProps) {
  const tanggal = formatTanggal(berita.tanggal);

  /* ================================================================
   * FEATURED — full-width card besar:
   *   - Gambar 420px tinggi, cover penuh
   *   - Judul font-display besar (xl→2xl)
   *   - Ringkasan lebih panjang (line-clamp-4)
   *   - Baca selengkapnya dengan ikon panah
   * ================================================================ */
  if (featured) {
    return (
      <article className="card group flex flex-col lg:flex-row lg:min-h-[340px]">
        {/* Gambar: full cover, landscape */}
        <div className="relative lg:w-[55%] shrink-0 overflow-hidden bg-primary-50">
          <Image
            src={berita.gambarUrl}
            alt={berita.judul}
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          {/* Gradient overlay bawah untuk mobile readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
        </div>

        {/* Konten */}
        <div className="flex flex-col justify-between p-7 lg:p-8 flex-1 gap-4">
          <div className="space-y-3">
            {/* Meta row */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge variant={berita.kategori} />
              <time
                className="text-text-muted text-xs font-body"
                dateTime={berita.tanggal}
              >
                {tanggal}
              </time>
            </div>

            {/* Judul — display font, besar */}
            <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary leading-snug">
              <Link
                href={`/berita/${berita.slug}`}
                className="hover:text-primary transition-colors duration-150"
              >
                {berita.judul}
              </Link>
            </h3>

            {/* Ringkasan — lebih panjang pada featured */}
            <p className="text-text-secondary text-sm font-body leading-relaxed line-clamp-4 max-w-none">
              {berita.ringkasan}
            </p>
          </div>

          {/* Footer row: penulis + CTA */}
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <p className="text-text-muted text-xs font-body">Oleh: {berita.penulis}</p>
            <Link
              href={`/berita/${berita.slug}`}
              className="inline-flex items-center gap-1.5 text-primary font-body font-medium text-sm hover:text-primary-dark transition-colors duration-150"
              aria-label={`Baca selengkapnya: ${berita.judul}`}
            >
              Baca selengkapnya
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  /* ================================================================
   * NORMAL — card vertikal standar (gambar atas, konten bawah)
   * Digunakan di grid 2-col pada halaman berita
   * ================================================================ */
  return (
    <article className="card group flex flex-col h-full">
      {/* Gambar */}
      <div className="relative h-48 overflow-hidden bg-primary-50 shrink-0">
        <Image
          src={berita.gambarUrl}
          alt={berita.judul}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>

      {/* Konten */}
      <div className="p-5 flex flex-col flex-1 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={berita.kategori} />
          <time className="text-text-muted text-xs font-body" dateTime={berita.tanggal}>
            {tanggal}
          </time>
        </div>
        <h3 className="font-body font-semibold text-base text-text-primary leading-snug line-clamp-2 flex-1">
          <Link
            href={`/berita/${berita.slug}`}
            className="hover:text-primary transition-colors duration-150"
          >
            {berita.judul}
          </Link>
        </h3>
        <p className="text-text-secondary text-sm font-body leading-relaxed line-clamp-3 max-w-none">
          {berita.ringkasan}
        </p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <p className="text-text-muted text-xs font-body">Oleh: {berita.penulis}</p>
          <Link
            href={`/berita/${berita.slug}`}
            className="text-primary text-xs font-body font-medium hover:text-primary-dark transition-colors inline-flex items-center gap-1"
          >
            Baca
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
