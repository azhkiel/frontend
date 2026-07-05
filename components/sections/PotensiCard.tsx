import Image from "next/image";
import type { Potensi } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface PotensiCardProps {
  item: Potensi;
  featured?: boolean;
}

// SVG icon: map pin (Heroicons outline, 16×16)
function IconMapPin() {
  return (
    <svg
      className="icon-sm text-text-muted shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </svg>
  );
}

// SVG icon: phone (Heroicons outline, 16×16)
function IconPhone() {
  return (
    <svg
      className="icon-sm text-text-muted shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z"
      />
    </svg>
  );
}

export default function PotensiCard({ item, featured = false }: PotensiCardProps) {
  return (
    <article className="card flex flex-col h-full">
      <div className={`relative overflow-hidden bg-primary-50 ${featured ? "h-56" : "h-44"}`}>
        <Image
          src={item.gambarUrl}
          alt={item.nama}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Badge variant={item.kategori} />
        <h3 className="font-body font-semibold text-base text-text-primary leading-snug">
          {item.nama}
        </h3>
        <p className="text-text-secondary text-sm font-body leading-relaxed line-clamp-4 flex-1 max-w-none">
          {item.deskripsi}
        </p>
        {/* Meta info: SVG icons, bukan emoji */}
        <div className="pt-2 border-t border-border mt-2 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <IconMapPin />
            <span className="text-xs text-text-muted">{item.lokasi}</span>
          </div>
          {item.kontak && (
            <div className="flex items-center gap-1.5">
              <IconPhone />
              <a
                href={`tel:${item.kontak}`}
                className="text-xs text-text-muted hover:text-primary transition-colors"
              >
                {item.kontak}
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
