import type { Profil } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

export default function HeroBeranda({ profil }: { profil: Profil }) {
  return (
    <section className="relative overflow-hidden" aria-label="Selamat datang di Desa Kedungpari">
      {/* Foto hero — full bleed */}
      <div className="relative h-[68dvh] min-h-[440px] max-h-[680px] w-full bg-primary-dark">
        <Image
          src={profil.heroImageUrl}
          alt={`Foto udara Desa ${profil.namaDesa}, ${profil.namaKecamatan}`}
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        {/* Overlay kiri — teks selalu terbaca */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 to-transparent" />
      </div>

      {/* Konten teks: left-aligned, tidak centered */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-3xl">
        {/* Label lokasi — plain, bukan pill/badge */}
        <p className="text-primary-100 font-body text-sm tracking-normal mb-5 opacity-90">
          Pemerintah Desa · Kecamatan {profil.namaKecamatan}, Kab. Jombang
        </p>

        {/* H1: explicit white */}
        <h1
          className="font-display font-bold text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1]"
          style={{ color: "#FFFFFF" }}
        >
          Desa<br />
          <span className="text-accent-light">{profil.namaDesa}</span>
        </h1>

        {/* Subheading */}
        <p className="mt-5 text-primary-100 font-body text-base sm:text-lg max-w-sm leading-relaxed">
          Informasi resmi desa — berita, potensi ekonomi, dan pelayanan publik untuk warga.
        </p>

        {/* CTA: solid accent (kontras jelas di atas bg hijau gelap) + text-link secondary */}
        <div className="mt-8 flex items-center gap-6 flex-wrap">
          <Link
            href="/potensi"
            id="hero-cta-potensi"
            className="inline-flex items-center gap-2 bg-accent text-primary-dark font-body font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-accent-light transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Potensi Desa
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/profil"
            id="hero-cta-profil"
            className="text-white font-body text-sm font-medium hover:text-accent-light transition-colors duration-150 underline-offset-4 hover:underline"
          >
            Profil Desa →
          </Link>
        </div>
      </div>
    </section>
  );
}
