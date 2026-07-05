import type { Metadata } from "next";
import { getPotensi } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/States";
import type { KategoriPotensi } from "@/lib/types";
import PotensiList from "@/components/sections/PotensiList";

export const metadata: Metadata = {
  title: "Potensi Desa Kedungpari",
  description: "UMKM, wisata, dan produk unggulan Desa Kedungpari, Kecamatan Mojowarno, Kabupaten Jombang.",
};

const KATEGORI: KategoriPotensi[] = ["UMKM", "Wisata", "Produk Unggulan"];

interface Props {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function PotensiPage({ searchParams }: Props) {
  const { kategori } = await searchParams;
  const activeKategori = KATEGORI.includes(kategori as KategoriPotensi)
    ? (kategori as KategoriPotensi)
    : undefined;

  const potensi = await getPotensi({ kategori: activeKategori });

  return (
    <>
      <PageHeader
        title="Potensi Desa"
        subtitle="Potensi ekonomi, wisata, dan produk unggulan Desa Kedungpari."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Potensi" }]}
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {potensi.length === 0 ? (
          <EmptyState message="Belum ada potensi untuk kategori ini." />
        ) : (
          <PotensiList potensi={potensi} activeKategori={activeKategori} />
        )}
      </div>
    </>
  );
}
