"use client";

import { useState } from "react";
import Image from "next/image";
import type { Galeri } from "@/lib/types";
import { EmptyState } from "@/components/ui/States";
import { useRevealGroup } from "@/hooks/useReveal";

const TIPE_FILTER = ["Semua", "foto", "video"] as const;
type TipeFilter = typeof TIPE_FILTER[number];

export default function GaleriGrid({ items }: { items: Galeri[] }) {
  const [lightbox, setLightbox] = useState<Galeri | null>(null);
  const [activeTipe, setActiveTipe] = useState<TipeFilter>("Semua");

  const gridRef = useRevealGroup<HTMLDivElement>(50);

  if (items.length === 0) return <EmptyState message="Belum ada foto atau video." />;

  const filtered = activeTipe === "Semua" ? items : items.filter((i) => i.tipe === activeTipe);

  return (
    <>
      {/* Filter tipe */}
      <div className="flex gap-2 mb-8" role="group" aria-label="Filter tipe galeri">
        {TIPE_FILTER.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTipe(t)}
            className={`font-body text-sm px-3.5 py-1.5 rounded-md border transition-colors duration-150 capitalize ${
              activeTipe === t
                ? "bg-primary text-white border-primary"
                : "bg-white text-text-secondary border-border hover:border-primary hover:bg-primary-50 hover:text-primary"
            }`}
          >
            {t === "Semua" ? "Semua" : t === "foto" ? "Foto" : "Video"}
          </button>
        ))}
      </div>

      {/* Masonry grid dengan stagger reveal */}
      <div
        ref={gridRef}
        className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3"
      >
        {filtered.map((item) => (
          <button
            key={item.id}
            id={`galeri-${item.id}`}
            className="reveal break-inside-avoid w-full rounded-lg overflow-hidden block cursor-pointer group relative"
            onClick={() => setLightbox(item)}
            aria-label={`Buka gambar: ${item.judul}`}
          >
            <div className="relative aspect-[4/3] bg-primary-50">
              <Image
                src={item.thumbnailUrl}
                alt={item.judul}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {item.tipe === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 rounded-full w-10 h-10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
              {/* Overlay caption */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/65 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-white text-xs font-body font-medium line-clamp-1 text-left">{item.judul}</p>
                <p className="text-white/70 text-xs font-body text-left">{new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.judul}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Header lightbox */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <p className="text-white font-body font-semibold text-sm">{lightbox.judul}</p>
                <p className="text-white/60 font-body text-xs">
                  {new Date(lightbox.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="text-white/70 hover:text-accent transition-colors p-2 rounded-md hover:bg-white/10"
                aria-label="Tutup lightbox"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Gambar */}
            <div className="relative w-full aspect-video bg-primary-dark rounded-lg overflow-hidden shadow-lg">
              <Image src={lightbox.url} alt={lightbox.judul} fill className="object-contain" sizes="90vw" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
