import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getBeritaBySlug, getBerita } from "@/lib/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const berita = await getBerita();
  return berita.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);
  if (!berita) return { title: "Berita Tidak Ditemukan" };
  return {
    title: berita.judul,
    description: berita.ringkasan,
    openGraph: {
      title: berita.judul,
      description: berita.ringkasan,
      images: [berita.gambarUrl],
    },
  };
}

// Renderer markdown sederhana — bukan library penuh, cukup untuk konten berita desa
function renderIsi(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("### "))
      return (
        <h3 key={i} className="font-body font-bold text-lg text-primary mt-7 mb-2.5">
          {line.slice(4)}
        </h3>
      );
    if (line.startsWith("## "))
      return (
        <h2 key={i} className="font-display font-bold text-xl text-primary mt-9 mb-3">
          {line.slice(3)}
        </h2>
      );
    if (line.startsWith("- "))
      return (
        <li key={i} className="ml-5 text-text-secondary font-body leading-relaxed list-disc">
          {renderInline(line.slice(2))}
        </li>
      );
    if (line.trim() === "") return <div key={i} className="h-3" />;
    return (
      <p key={i} className="font-body text-text-secondary leading-relaxed text-base max-w-none">
        {renderInline(line)}
      </p>
    );
  });
}

function renderInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-text-primary">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);
  if (!berita) notFound();

  const tanggal = new Date(berita.tanggal).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Breadcrumb minimal di atas, bukan PageHeader penuh (judul terlalu panjang untuk subtitle) */}
      <div className="bg-primary-50 border-b border-primary-100">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-5">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-2 text-sm text-text-muted font-body" role="list">
              <li>
                <a href="/" className="hover:text-primary transition-colors">Beranda</a>
              </li>
              <li aria-hidden="true" className="text-primary-100">›</li>
              <li>
                <a href="/berita" className="hover:text-primary transition-colors">Berita</a>
              </li>
              <li aria-hidden="true" className="text-primary-100">›</li>
              <li>
                <span className="text-text-secondary font-medium line-clamp-1">{berita.kategori}</span>
              </li>
            </ol>
          </nav>
          {/* Judul artikel sebagai H1 — font-display besar */}
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-primary leading-snug">
            {berita.judul}
          </h1>
          <div className="mt-4 h-0.5 w-12 bg-accent" />
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 sm:px-8 py-10">
        {/* Meta baris: badge + tanggal + penulis */}
        <div className="flex flex-wrap items-center gap-3 mb-7">
          <Badge variant={berita.kategori} />
          <time className="text-text-muted text-sm font-body" dateTime={berita.tanggal}>
            {tanggal}
          </time>
          <span className="text-text-muted text-sm font-body">· Oleh {berita.penulis}</span>
        </div>

        {/* Gambar utama — lebih tinggi (sm:h-[420px]) */}
        <div className="relative w-full h-56 sm:h-[420px] rounded-lg overflow-hidden mb-9 bg-primary-50">
          <Image
            src={berita.gambarUrl}
            alt={berita.judul}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        {/* Konten artikel */}
        <div className="space-y-3">
          {renderIsi(berita.isi)}
        </div>

        {/* Footer artikel */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-3">
          <Button href="/berita" variant="outline" id="berita-detail-kembali">
            ← Kembali ke Berita
          </Button>
          <p className="text-text-muted text-xs font-body">
            Diterbitkan: {tanggal}
          </p>
        </div>
      </article>
    </>
  );
}
