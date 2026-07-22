"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useProfilDesa } from "@/hooks/useProfilDesa";

const NAV_LINKS = [
  { href: "/",         label: "Beranda"  },
  { href: "/profil",   label: "Profil"   },
  { href: "/berita",   label: "Berita"   },
  { href: "/potensi",  label: "Potensi"  },
  { href: "/galeri",   label: "Galeri"   },
  { href: "/struktur", label: "Struktur" },
  { href: "/peta",     label: "Peta & Data" },
];

export default function Navbar() {
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);
  const { profil } = useProfilDesa();

  const namaDesa   = profil?.namaDesa   ?? "Desa Kedungpari";
  const kecamatan  = profil?.namaKecamatan ?? "Kec. Mojowarno, Kab. Jombang";
  const logoUrl    = profil?.logoUrl ?? null;
  // Ambil singkatan 2 huruf dari nama desa sebagai fallback
  const logoFallback = namaDesa
    .split(" ")
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-primary-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigasi utama">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Nama Desa */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={`Logo ${namaDesa}`}
                className="w-9 h-9 rounded-full object-contain"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-body font-bold text-xs leading-none"
                aria-hidden="true"
              >
                {logoFallback || "DS"}
              </div>
            )}
            <div className="leading-tight">
              <p className="font-display font-bold text-primary text-sm sm:text-base leading-none">
                {namaDesa}
              </p>
              <p className="text-text-muted text-xs font-body">{kecamatan}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      "px-3 py-2 rounded-md font-body text-sm font-medium transition-colors",
                      active
                        ? "bg-primary-50 text-primary font-semibold"
                        : "text-text-secondary hover:text-primary hover:bg-primary-50",
                    ].join(" ")}
                    aria-current={active ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            id="nav-toggle"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="lg:hidden p-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary-50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <ul id="mobile-menu" className="lg:hidden pb-3 space-y-1" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={[
                      "block px-3 py-2 rounded-md font-body text-sm font-medium transition-colors",
                      active
                        ? "bg-primary-50 text-primary font-semibold"
                        : "text-text-secondary hover:text-primary hover:bg-primary-50",
                    ].join(" ")}
                    aria-current={active ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </header>
  );
}
