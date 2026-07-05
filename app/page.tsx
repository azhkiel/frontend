import { getProfil, getBerita, getPotensi, getStatistik } from "@/lib/api";
import HeroBeranda from "@/components/sections/HeroBeranda";
import Button from "@/components/ui/Button";
import { BeritaSection, PotensiSection, VisiSection } from "@/components/sections/HomepageSections";

export default async function BerandaPage() {
  const [profil, berita, potensi, statistik] = await Promise.all([
    getProfil(),
    getBerita({ limit: 4 }),
    getPotensi(),
    getStatistik(),
  ]);

  const potensiUnggulan = potensi.slice(0, 3);
  const beritaFeatured = berita[0];
  const beritaRest = berita.slice(1);

  return (
    <>
      <HeroBeranda profil={profil} />

      {/* Statistik bar */}
      <section
        style={{ backgroundColor: "#2F5233" }}
        className="py-10 border-b-4 border-accent"
        aria-label="Statistik desa"
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-0">
            <div className="text-center sm:text-left sm:pr-10 sm:border-r sm:border-primary-light/50">
              <p className="tabular-nums font-display font-bold text-5xl text-white leading-none">
                {statistik.jumlahPenduduk.toLocaleString("id-ID")}
              </p>
              <p className="text-primary-100 font-body text-sm mt-2">jiwa terdaftar</p>
            </div>
            <div className="text-center sm:text-left sm:px-10 sm:border-r sm:border-primary-light/50">
              <p className="tabular-nums font-display font-bold text-5xl text-white leading-none">
                {statistik.jumlahKK.toLocaleString("id-ID")}
              </p>
              <p className="text-primary-100 font-body text-sm mt-2">kepala keluarga</p>
            </div>
            <div className="flex items-center gap-10 sm:pl-10">
              <div className="text-center">
                <p className="tabular-nums font-display font-bold text-3xl text-white leading-none">
                  {profil.jumlahDusun}
                </p>
                <p className="text-primary-100 font-body text-xs mt-2">dusun</p>
              </div>
              <div className="w-px h-10 bg-primary-light/40" />
              <div className="text-center">
                <p className="tabular-nums font-display font-bold text-3xl text-white leading-none">
                  {profil.luasWilayah}
                </p>
                <p className="text-primary-100 font-body text-xs mt-2">km² luas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berita terbaru — client section dengan animasi reveal */}
      <section className="py-14 bg-surface" aria-label="Berita terbaru">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display font-bold text-2xl text-primary">Berita Terbaru</h2>
              <div className="mt-2 h-0.5 w-10 bg-accent" />
            </div>
            <Button href="/berita" variant="outline" id="beranda-berita-selengkapnya">
              Semua berita
            </Button>
          </div>

          {berita.length > 0 && beritaFeatured && (
            <BeritaSection featured={beritaFeatured} rest={beritaRest} />
          )}
        </div>
      </section>

      {/* Potensi unggulan — client section dengan animasi stagger */}
      <section className="pt-14 pb-16" aria-label="Potensi desa unggulan">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display font-bold text-2xl text-primary">Potensi Desa</h2>
              <div className="mt-2 h-0.5 w-10 bg-accent" />
            </div>
            <Button href="/potensi" variant="outline" id="beranda-potensi-selengkapnya">
              Lihat semua
            </Button>
          </div>
          <PotensiSection items={potensiUnggulan} />
        </div>
      </section>

      {/* Visi — reveal animasi dari kiri */}
      <VisiSection visi={profil.visi} />
    </>
  );
}
