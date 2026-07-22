import type { Metadata } from "next";
import { getProfil } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Profil Desa",
  description: "Profil, sejarah, visi, dan misi Desa Kedungpari, Kecamatan Mojowarno, Kabupaten Jombang.",
};

export default async function ProfilPage() {
  const profil = await getProfil();
  const misiList = profil.misi.split("\n").filter(Boolean);

  return (
    <>
      <PageHeader
        title="Profil Desa"
        subtitle={`Desa ${profil.namaDesa}, Kecamatan ${profil.namaKecamatan}, Kabupaten ${profil.namaKabupaten}`}
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Profil" }]}
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-12 space-y-14">

        {/* Info dasar — 4 tile dengan padding lebih besar */}
        <section aria-label="Informasi dasar desa">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Nama Desa", value: profil.namaDesa },
              { label: "Kecamatan", value: profil.namaKecamatan },
              { label: "Luas Wilayah", value: `${profil.luasWilayah} km²` },
              { label: "Jumlah Dusun", value: `${profil.jumlahDusun} dusun` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-primary-50 rounded-lg p-5 border border-primary-100">
                {/* label: text-text-secondary (#4A4A40) bukan text-muted — lebih terbaca */}
                <p className="text-text-secondary text-xs font-body">{label}</p>
                <p className="font-body font-bold text-primary mt-1.5 text-base">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sejarah */}
        <section aria-label="Sejarah desa">
          <h2 className="font-display font-bold text-xl text-primary mb-1">Sejarah Singkat</h2>
          <div className="h-0.5 w-10 bg-accent mb-5" />
          <p className="font-body text-text-secondary leading-relaxed max-w-3xl">{profil.sejarahSingkat}</p>
        </section>

        {/* Visi & Misi */}
        <section aria-label="Visi dan misi desa" className="grid md:grid-cols-2 gap-6">
          {/* Visi: teks putih di atas bg primary — contrast fix */}
          <div className="rounded-lg p-7 bg-primary">
            <h2 className="font-display font-bold text-base mb-3" style={{ color: "#D9A441" }}>
              Visi
            </h2>
            {/* Ganti dari primary-100 (#D3E5D7) ke putih — jauh lebih kontras */}
            <p className="font-body leading-relaxed text-base" style={{ color: "#FFFFFF" }}>
              {profil.visi}
            </p>
          </div>

          {/* Misi */}
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-7">
            <h2 className="font-display font-bold text-base text-primary mb-4">Misi</h2>
            <ol className="space-y-3 list-none">
              {misiList.map((m, i) => (
                <li key={i} className="font-body text-text-secondary text-sm leading-relaxed flex gap-3">
                  <span className="text-accent font-bold font-body tabular-nums shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <span>{m}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </>
  );
}
