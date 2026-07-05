"use client";

import Image from "next/image";
import type { StrukturOrganisasi } from "@/lib/types";
import { useRevealGroup, useReveal } from "@/hooks/useReveal";

export default function StrukturOrgChart({ items }: { items: StrukturOrganisasi[] }) {
  const sorted = [...items].sort((a, b) => a.urutan - b.urutan);
  const kepala = sorted.find(s => s.jabatan.toLowerCase().includes("kepala desa"));
  const sekdes  = sorted.find(s => s.jabatan.toLowerCase().includes("sekretaris"));
  const others  = sorted.filter(s => s.id !== kepala?.id && s.id !== sekdes?.id);

  const topRef = useReveal<HTMLDivElement>();
  const gridRef = useRevealGroup<HTMLDivElement>(65);

  return (
    <div className="space-y-10">
      {/* Kepala Desa & Sekdes — row teratas dengan reveal */}
      <div ref={topRef} className="reveal flex flex-col sm:flex-row items-center justify-center gap-6">
        {[kepala, sekdes].filter(Boolean).map((p) => p && (
          <OfficialCard key={p.id} person={p} featured />
        ))}
      </div>

      {/* Divider dengan label */}
      <div className="flex items-center gap-4 max-w-lg mx-auto">
        <div className="flex-1 h-px bg-primary-100" />
        <span className="text-text-muted text-xs font-body px-2 shrink-0">Perangkat Desa</span>
        <div className="flex-1 h-px bg-primary-100" />
      </div>

      {/* Perangkat lainnya — stagger reveal */}
      <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {others.map((p) => (
          <div key={p.id} className="reveal">
            <OfficialCard person={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

function OfficialCard({
  person,
  featured = false,
}: {
  person: StrukturOrganisasi;
  featured?: boolean;
}) {
  return (
    <div
      className={`card text-center p-5 transition-shadow duration-150 ${
        featured ? "sm:w-56" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`relative mx-auto rounded-full overflow-hidden bg-primary-50 mb-3 ring-2 ring-primary-100 ${
          featured ? "w-24 h-24" : "w-16 h-16"
        }`}
      >
        <Image
          src={person.fotoUrl}
          alt={`Foto ${person.nama}, ${person.jabatan}`}
          fill
          className="object-cover"
          sizes={featured ? "96px" : "64px"}
        />
      </div>

      {/* Nama */}
      <p
        className={`font-body font-semibold text-text-primary leading-tight ${
          featured ? "text-base" : "text-sm"
        }`}
      >
        {person.nama}
      </p>

      {/* Jabatan */}
      <p className="text-text-muted text-xs font-body mt-1">{person.jabatan}</p>

      {/* Kontak */}
      {person.noHp && (
        <a
          href={`tel:${person.noHp}`}
          className="mt-2.5 inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors font-body"
          aria-label={`Hubungi ${person.nama}`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />
          </svg>
          {person.noHp}
        </a>
      )}
    </div>
  );
}
