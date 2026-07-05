import type { Metadata } from "next";
import { getStruktur } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import StrukturOrgChart from "@/components/sections/StrukturOrgChart";

export const metadata: Metadata = {
  title: "Struktur Pemerintahan Desa Kedungpari",
  description: "Struktur organisasi dan kontak perangkat Desa Kedungpari, Kecamatan Mojowarno, Kabupaten Jombang.",
};

export default async function StrukturPage() {
  const struktur = await getStruktur();

  return (
    <>
      <PageHeader
        title="Struktur Pemerintahan"
        subtitle="Susunan perangkat Desa Kedungpari periode 2023–2029."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Struktur" }]}
      />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-12 space-y-14">

        {/* Org Chart dengan animasi */}
        <section aria-label="Bagan organisasi desa">
          <StrukturOrgChart items={struktur} />
        </section>

        {/* Tabel kontak */}
        <section aria-label="Kontak perangkat desa">
          <h2 className="font-display font-bold text-xl text-primary mb-1">Kontak Perangkat Desa</h2>
          <div className="h-0.5 w-10 bg-accent mb-6" />
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm font-body border-collapse">
              <thead>
                <tr className="bg-primary-50 border-b border-primary-100">
                  <th className="px-5 py-3 text-left font-body font-semibold text-xs text-text-secondary">Nama</th>
                  <th className="px-5 py-3 text-left font-body font-semibold text-xs text-text-secondary">Jabatan</th>
                  <th className="px-5 py-3 text-left font-body font-semibold text-xs text-text-secondary">Kontak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...struktur].sort((a, b) => a.urutan - b.urutan).map((s) => (
                  <tr key={s.id} className="hover:bg-primary-50/50 transition-colors duration-100">
                    <td className="px-5 py-3 font-medium text-text-primary">{s.nama}</td>
                    <td className="px-5 py-3 text-text-secondary">{s.jabatan}</td>
                    <td className="px-5 py-3">
                      {s.noHp ? (
                        <a
                          href={`tel:${s.noHp}`}
                          className="text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
                        >
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />
                          </svg>
                          {s.noHp}
                        </a>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
