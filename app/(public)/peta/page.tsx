import type { Metadata } from "next";
import { getStatistik, getProfil } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import StatistikGrid from "@/components/sections/StatistikGrid";
import PetaEmbed from "@/components/sections/PetaEmbed";

export const metadata: Metadata = {
  title: "Peta & Data Desa Kedungpari",
  description: "Peta lokasi dan data statistik kependudukan Desa Kedungpari, Kecamatan Mojowarno, Kabupaten Jombang.",
};

export default async function PetaPage() {
  const [statistik, profil] = await Promise.all([getStatistik(), getProfil()]);

  return (
    <>
      <PageHeader
        title="Peta & Data Desa"
        subtitle="Lokasi geografis dan data statistik kependudukan Desa Kedungpari."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Peta & Data" }]}
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-12 space-y-14">

        {/* Peta */}
        <section aria-label="Peta lokasi desa">
          <h2 className="font-display font-bold text-xl text-primary mb-1">Lokasi Desa</h2>
          <div className="h-0.5 w-10 bg-accent mb-6" />
          <PetaEmbed
            latitude={statistik.latitude}
            longitude={statistik.longitude}
            namaDesa={profil.namaDesa}
          />
        </section>

        {/* Statistik */}
        <section aria-label="Data statistik kependudukan">
          <h2 className="font-display font-bold text-xl text-primary mb-1">Data Kependudukan</h2>
          <div className="h-0.5 w-10 bg-accent mb-6" />
          <StatistikGrid data={statistik} />
        </section>

      </div>
    </>
  );
}
