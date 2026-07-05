interface PetaEmbedProps {
  latitude: number;
  longitude: number;
  namaDesa: string;
}

export default function PetaEmbed({ latitude, longitude, namaDesa }: PetaEmbedProps) {
  // Koordinat statis — tidak bergantung pada API key
  const mapsUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_MAPS_KEY&q=${latitude},${longitude}&zoom=14`;
  const lon1 = (longitude - 0.015).toFixed(4);
  const lat1 = (latitude - 0.01).toFixed(4);
  const lon2 = (longitude + 0.015).toFixed(4);
  const lat2 = (latitude + 0.01).toFixed(4);
  const fallbackUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon1}%2C${lat1}%2C${lon2}%2C${lat2}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div className="space-y-3">
      <div className="rounded-lg overflow-hidden border border-border shadow-sm">
        <iframe
          title={`Peta lokasi Desa ${namaDesa}`}
          src={fallbackUrl}
          width="100%"
          height="400"
          className="block w-full"
          loading="lazy"
          allowFullScreen
        />
      </div>
      <p className="text-xs text-text-muted text-center">
        Koordinat: {latitude.toFixed(4)}° LS, {longitude.toFixed(4)}° BT — {namaDesa}, Kecamatan Mojowarno
      </p>
      <a
        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors font-body"
      >
        Buka di Google Maps →
      </a>
    </div>
  );
}
