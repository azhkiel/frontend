import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Desa Kedungpari — Kecamatan Mojowarno, Kabupaten Jombang",
    template: "%s | Desa Kedungpari",
  },
  description:
    "Website resmi Pemerintah Desa Kedungpari, Kecamatan Mojowarno, Kabupaten Jombang. Informasi profil desa, berita, potensi ekonomi, galeri, dan struktur pemerintahan.",
  keywords: ["Desa Kedungpari", "Mojowarno", "Jombang", "KKN", "profil desa", "pemerintah desa"],
  authors: [{ name: "Tim KKN Desa Kedungpari" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Desa Kedungpari",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload critical fonts: Bricolage Grotesque (display) + Plus Jakarta Sans (body) */}
      </head>
      <body className="flex flex-col min-h-screen font-body text-text-primary bg-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
