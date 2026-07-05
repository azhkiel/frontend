import type { Statistik } from "@/lib/types";
import StatTile from "@/components/ui/StatTile";

export default function StatistikGrid({ data }: { data: Statistik }) {
  const rasioJK = data.jumlahLakiLaki > 0
    ? ((data.jumlahPerempuan / data.jumlahLakiLaki) * 100).toFixed(0)
    : "-";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Jumlah Penduduk" value={data.jumlahPenduduk} unit="jiwa" />
        <StatTile label="Kepala Keluarga" value={data.jumlahKK} unit="KK" />
        <StatTile label="Laki-laki" value={data.jumlahLakiLaki} unit="jiwa" />
        <StatTile label="Perempuan" value={data.jumlahPerempuan} unit="jiwa" />
      </div>

      {/* Tabel detail */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm font-body border-collapse">
          <caption className="text-left text-text-muted text-xs mb-2">
            Data kependudukan tahun {data.tahunData}
          </caption>
          <thead>
            <tr className="bg-primary-50 text-text-secondary border-b border-primary-100">
              <th className="px-4 py-2.5 text-left font-body font-semibold text-xs text-text-secondary">Indikator</th>
              <th className="px-4 py-2.5 text-right font-body font-semibold text-xs text-text-secondary">Nilai</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr><td className="px-4 py-2 text-text-secondary">Total Penduduk</td><td className="px-4 py-2 text-right tabular-nums font-medium">{data.jumlahPenduduk.toLocaleString("id-ID")} jiwa</td></tr>
            <tr><td className="px-4 py-2 text-text-secondary">Jumlah KK</td><td className="px-4 py-2 text-right tabular-nums font-medium">{data.jumlahKK.toLocaleString("id-ID")} KK</td></tr>
            <tr><td className="px-4 py-2 text-text-secondary">Laki-laki</td><td className="px-4 py-2 text-right tabular-nums font-medium">{data.jumlahLakiLaki.toLocaleString("id-ID")} jiwa</td></tr>
            <tr><td className="px-4 py-2 text-text-secondary">Perempuan</td><td className="px-4 py-2 text-right tabular-nums font-medium">{data.jumlahPerempuan.toLocaleString("id-ID")} jiwa</td></tr>
            <tr><td className="px-4 py-2 text-text-secondary">Rasio Jenis Kelamin</td><td className="px-4 py-2 text-right tabular-nums font-medium">{rasioJK}</td></tr>
            <tr><td className="px-4 py-2 text-text-secondary">Rata-rata anggota/KK</td><td className="px-4 py-2 text-right tabular-nums font-medium">{(data.jumlahPenduduk / data.jumlahKK).toFixed(1)}</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-muted mt-3">Sumber: Administrasi Desa Kedungpari, {data.tahunData}</p>
    </div>
  );
}
