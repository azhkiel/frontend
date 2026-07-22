import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBeritaBySlug, getBerita } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import type { KategoriBerita } from "@/lib/types";

// ── Warna badge per kategori ──────────────────────────────────────────────────
const KATEGORI_COLOR: Record<KategoriBerita, string> = {
  Pengumuman: "bg-blue-100 text-blue-700 border-blue-200",
  Kegiatan:   "bg-green-100 text-green-700 border-green-200",
  Pembangunan:"bg-amber-100 text-amber-700 border-amber-200",
  Lainnya:    "bg-gray-100  text-gray-600  border-gray-200",
};

// ── Generate dynamic metadata ─────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);
  if (!berita) return { title: "Berita tidak ditemukan" };

  return {
    title: `${berita.judul} — Desa Kedungpari`,
    description: berita.ringkasan,
    openGraph: {
      title: berita.judul,
      description: berita.ringkasan,
      images: berita.gambarUrl ? [{ url: berita.gambarUrl }] : [],
    },
  };
}

// ── Pre-generate slug paths agar tidak 404 saat build (opsional tapi dianjurkan) ──
export async function generateStaticParams() {
  try {
    const semua = await getBerita();
    return semua.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

// ── Render konten "markdown ringan": **bold**, *italic*, baris kosong = paragraf baru ──
function renderIsi(raw: string): React.ReactNode {
  if (!raw) return null;
  const paragraphs = raw.split(/\n\n+/);
  return paragraphs.map((para, pi) => {
    const lines = para.split(/\n/);
    const nodes = lines.flatMap((line, li) => {
      // Render inline: **bold** dan *italic*
      const parts: React.ReactNode[] = [];
      let rest = line;
      let key = 0;
      while (rest.length > 0) {
        const boldIdx  = rest.indexOf("**");
        const italicIdx = rest.indexOf("*");
        if (boldIdx !== -1 && (italicIdx === -1 || boldIdx <= italicIdx)) {
          const end = rest.indexOf("**", boldIdx + 2);
          if (end !== -1) {
            parts.push(rest.slice(0, boldIdx));
            parts.push(<strong key={key++}>{rest.slice(boldIdx + 2, end)}</strong>);
            rest = rest.slice(end + 2);
            continue;
          }
        } else if (italicIdx !== -1) {
          const end = rest.indexOf("*", italicIdx + 1);
          if (end !== -1) {
            parts.push(rest.slice(0, italicIdx));
            parts.push(<em key={key++}>{rest.slice(italicIdx + 1, end)}</em>);
            rest = rest.slice(end + 1);
            continue;
          }
        }
        parts.push(rest);
        rest = "";
      }
      return li < lines.length - 1 ? [...parts, <br key={`br-${li}`} />] : parts;
    });
    return (
      <p key={pi} className="mb-4 leading-relaxed text-text-secondary font-body text-base">
        {nodes}
      </p>
    );
  });
}

// ── Format tanggal ─────────────────────────────────────────────────────────────
function formatTanggal(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BeritaDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);

  if (!berita) notFound();

  const badgeClass = KATEGORI_COLOR[berita.kategori] ?? KATEGORI_COLOR.Lainnya;
  const tanggalFormatted = formatTanggal(berita.tanggal);

  return (
    <>
      <PageHeader
        title={berita.judul}
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Berita", href: "/berita" },
          { label: berita.judul },
        ]}
      />

      <article className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {/* Meta baris: kategori + tanggal + penulis */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm font-body">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-semibold ${badgeClass}`}
          >
            {berita.kategori}
          </span>
          <time
            dateTime={berita.tanggal}
            className="text-text-muted flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {tanggalFormatted}
          </time>
          <span className="text-text-muted flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {berita.penulis}
          </span>
        </div>

        {/* Ringkasan / lead */}
        {berita.ringkasan && (
          <p className="mb-6 text-base font-body font-medium text-text-secondary leading-relaxed border-l-4 border-accent pl-4 italic">
            {berita.ringkasan}
          </p>
        )}

        {/* Gambar utama */}
        {berita.gambarUrl && (
          <figure className="mb-8 rounded-xl overflow-hidden border border-primary-100 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={berita.gambarUrl}
              alt={berita.judul}
              className="w-full object-cover max-h-[420px]"
              loading="eager"
            />
          </figure>
        )}

        {/* Isi artikel */}
        <div className="prose-custom">
          {renderIsi(berita.isi)}
        </div>

        {/* Divider + tombol kembali */}
        <div className="mt-10 pt-6 border-t border-primary-100">
          <a
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-body font-medium text-primary hover:text-primary-dark transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar Berita
          </a>
        </div>
      </article>
    </>
  );
}
