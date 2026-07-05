import type { Metadata } from "next";
import { getGaleri } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import GaleriGrid from "@/components/sections/GaleriGrid";

export const metadata: Metadata = {
  title: "Galeri Desa Kedungpari",
  description: "Galeri foto dan video kegiatan Desa Kedungpari, Kecamatan Mojowarno, Kabupaten Jombang.",
};

export default async function GaleriPage() {
  const galeri = await getGaleri();

  return (
    <>
      <PageHeader
        title="Galeri"
        subtitle="Foto dan video kegiatan, potensi, dan kehidupan Desa Kedungpari."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Galeri" }]}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        <GaleriGrid items={galeri} />
      </div>
    </>
  );
}
