"use client";

import { useRevealGroup, useReveal } from "@/hooks/useReveal";
import BeritaCard from "@/components/sections/BeritaCard";
import PotensiCard from "@/components/sections/PotensiCard";
import type { Berita, Potensi } from "@/lib/types";

interface BeritaSectionProps {
  featured: Berita;
  rest: Berita[];
}

export function BeritaSection({ featured, rest }: BeritaSectionProps) {
  const sectionRef = useRevealGroup<HTMLDivElement>(90);

  return (
    <div ref={sectionRef} className="space-y-6">
      <div className="reveal">
        <BeritaCard berita={featured} featured />
      </div>
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((b) => (
            <div key={b.id} className="reveal flex">
              <BeritaCard berita={b} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PotensiSectionProps {
  items: Potensi[];
}

export function PotensiSection({ items }: PotensiSectionProps) {
  const gridRef = useRevealGroup<HTMLDivElement>(80);

  return (
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {items.map((p) => (
        <div key={p.id} className="reveal">
          <PotensiCard item={p} />
        </div>
      ))}
    </div>
  );
}

export function VisiSection({ visi }: { visi: string }) {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      className="reveal bg-primary-50 border-t border-primary-100 pt-12 pb-14"
    >
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <p className="text-text-muted font-body text-sm mb-4">Visi Desa Kedungpari</p>
        <blockquote className="font-display font-bold text-xl sm:text-2xl text-primary leading-snug border-l-4 border-accent pl-6">
          &ldquo;{visi}&rdquo;
        </blockquote>
      </div>
    </section>
  );
}
