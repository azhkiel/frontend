import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-auto">
      {/* Accent bar atas */}
      <div className="h-1 bg-accent" />

      {/* Konten footer: asymmetric grid — bukan 3 kolom sama rata */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8">

          {/* Identitas Desa — kolom lebar (2fr) */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {/* Logo: monogram dalam lingkaran — semantic, bukan letter-in-square */}
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-body font-bold text-sm" aria-hidden="true">
                DS
              </div>
              <div>
                <p className="font-body font-semibold text-base leading-tight">Desa Kedungpari</p>
                <p className="text-primary-100 text-xs">Kecamatan Mojowarno, Kabupaten Jombang</p>
              </div>
            </div>
            <p className="text-primary-100 text-sm leading-relaxed max-w-xs">
              Website resmi Pemerintah Desa Kedungpari. Informasi publik: berita, layanan warga, dan data desa.
            </p>
          </div>

          {/* Kontak Resmi — kolom 1fr */}
          <div>
            <h3 className="font-body font-semibold text-sm text-accent mb-3">
              Kontak
            </h3>
            <address className="not-italic text-primary-100 text-sm space-y-1">
              <p>Balai Desa Kedungpari</p>
              <p>Jl. Balai Desa No. 1, Dusun Krajan</p>
              <p>Kab. Jombang 61475</p>
              <p className="pt-2">
                <a href="mailto:desa.kedungpari@jombangkab.go.id" className="hover:text-accent transition-colors break-all">
                  desa.kedungpari@jombangkab.go.id
                </a>
              </p>
            </address>
          </div>

          {/* Jam Layanan — kolom 1fr */}
          <div>
            <h3 className="font-body font-semibold text-sm text-accent mb-3">
              Jam Layanan
            </h3>
            <table className="text-primary-100 text-sm w-full">
              <tbody>
                <tr>
                  <td className="pr-3 pb-1">Sen – Kam</td>
                  <td className="pb-1">07.30 – 15.00</td>
                </tr>
                <tr>
                  <td className="pr-3 pb-1">Jumat</td>
                  <td className="pb-1">07.30 – 11.30</td>
                </tr>
                <tr>
                  <td className="pr-3">Sab – Min</td>
                  <td className="text-primary-100/60">Tutup</td>
                </tr>
              </tbody>
            </table>
            <p className="text-primary-100/70 text-xs mt-3">
              Pengaduan darurat: hubungi Kepala Dusun.
            </p>
          </div>
        </div>

        {/* Bottom bar — minimal, hanya real links */}
        <div className="border-t border-primary-light mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-primary-100 text-xs">
          <p>© {year} Pemerintah Desa Kedungpari, Kab. Jombang.</p>
          <p>
            Dikembangkan oleh{" "}
            <span className="text-accent font-medium">Tim KKN</span> — {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
