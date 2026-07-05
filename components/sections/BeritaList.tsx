"use client";

import { useReveal, useRevealGroup } from "@/hooks/useReveal";
import BeritaCard from "@/components/sections/BeritaCard";
import type { Berita, KategoriBerita } from "@/lib/types";

const KATEGORI: KategoriBerita[] = ["Pengumuman", "Kegiatan", "Pembangunan", "Lainnya"];

interface BeritaListProps {
  berita: Berita[];
  activeKategori?: KategoriBerita;
}

export default function BeritaList({ berita, activeKategori }: BeritaListProps) {
  const gridRef = useRevealGroup<HTMLDivElement>(70);
  const filterRef = useReveal<HTMLDivElement>();

  const featured = berita[0];
  const rest = berita.slice(1);

  return (
    <>
      {/* Filter kategori */}
      <div ref={filterRef} className="reveal flex flex-wrap gap-2 mb-12">
        <a
          href="/berita"
          id="filter-berita-semua"
          className={`font-body text-sm px-3.5 py-1.5 rounded-md border transition-colors duration-150 cursor-pointer ${
            !activeKategori
              ? "bg-primary text-white border-primary"
              : "bg-white text-text-secondary border-border hover:border-primary hover:bg-primary-50 hover:text-primary"
          }`}
        >
          Semua
        </a>
        {KATEGORI.map((k) => (
          <a
            key={k}
            href={`/berita?kategori=${k}`}
            id={`filter-berita-${k.toLowerCase()}`}
            className={`font-body text-sm px-3.5 py-1.5 rounded-md border transition-colors duration-150 cursor-pointer ${
              activeKategori === k
                ? "bg-primary text-white border-primary"
                : "bg-white text-text-secondary border-border hover:border-primary hover:bg-primary-50 hover:text-primary"
            }`}
          >
            {k}
          </a>
        ))}
      </div>

      {/* Layout berita: featured besar di atas, grid 2-col di bawah */}
      {berita.length > 0 && (
        <div ref={gridRef} className="space-y-6">
          {/* Featured — full width, card besar */}
          {featured && (
            <div className="reveal">
              <BeritaCard berita={featured} featured />
            </div>
          )}

          {/* Sisa berita — grid 2 kolom */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {rest.map((b) => (
                <div key={b.id} className="reveal">
                  <BeritaCard berita={b} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
