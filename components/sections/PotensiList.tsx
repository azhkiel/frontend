"use client";

import { useRevealGroup } from "@/hooks/useReveal";
import PotensiCard from "@/components/sections/PotensiCard";
import type { Potensi, KategoriPotensi } from "@/lib/types";

const KATEGORI: KategoriPotensi[] = ["UMKM", "Wisata", "Produk Unggulan"];

interface PotensiListProps {
  potensi: Potensi[];
  activeKategori?: KategoriPotensi;
}

export default function PotensiList({ potensi, activeKategori }: PotensiListProps) {
  const gridRef = useRevealGroup<HTMLDivElement>(80);

  return (
    <>
      {/* Filter kategori */}
      <div className="flex flex-wrap gap-2 mb-10">
        <a
          href="/potensi"
          id="filter-potensi-semua"
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
            href={`/potensi?kategori=${encodeURIComponent(k)}`}
            id={`filter-potensi-${k.toLowerCase().replace(/\s+/g, "-")}`}
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

      {/* Grid potensi dengan stagger reveal */}
      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {potensi.map((p) => (
          <div key={p.id} className="reveal">
            <PotensiCard item={p} />
          </div>
        ))}
      </div>
    </>
  );
}
