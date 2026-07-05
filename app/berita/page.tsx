import type { Metadata } from "next";
import { getBerita } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/States";
import type { KategoriBerita } from "@/lib/types";
import BeritaList from "@/components/sections/BeritaList";

export const metadata: Metadata = {
  title: "Berita Desa Kedungpari",
  description: "Berita, pengumuman, dan kegiatan terbaru Desa Kedungpari, Kecamatan Mojowarno, Kabupaten Jombang.",
};

const KATEGORI: KategoriBerita[] = ["Pengumuman", "Kegiatan", "Pembangunan", "Lainnya"];

interface Props {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function BeritaPage({ searchParams }: Props) {
  const { kategori } = await searchParams;
  const activeKategori = KATEGORI.includes(kategori as KategoriBerita)
    ? (kategori as KategoriBerita)
    : undefined;

  const berita = await getBerita({ kategori: activeKategori });

  return (
    <>
      <PageHeader
        title="Berita Desa"
        subtitle="Informasi terkini seputar kegiatan, pengumuman, dan pembangunan Desa Kedungpari."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Berita" }]}
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {berita.length === 0 ? (
          <EmptyState message="Belum ada berita untuk kategori ini." />
        ) : (
          <BeritaList berita={berita} activeKategori={activeKategori} />
        )}
      </div>
    </>
  );
}
