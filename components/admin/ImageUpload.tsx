"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { uploadGambar, type UploadFolder } from "@/lib/api";
import { getSession } from "@/lib/auth";

interface ImageUploadProps {
  /** URL gambar saat ini (untuk preview / sudah upload sebelumnya) */
  currentUrl?: string;
  folder: UploadFolder;
  onUpload: (url: string) => void;
  label?: string;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const ACCEPTED_EXT = "JPG, PNG, WebP, GIF";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageUpload({
  currentUrl,
  folder,
  onUpload,
  label = "Gambar",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedInfo, setUploadedInfo] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync preview ketika currentUrl berubah dari luar (misal: form load data existing)
  useEffect(() => {
    if (currentUrl && !isUploading) {
      setPreview(currentUrl);
    }
  }, [currentUrl, isUploading]);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validasi tipe file
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(`Format tidak didukung. Gunakan: ${ACCEPTED_EXT}.`);
        return;
      }

      // Validasi ukuran
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Ukuran file terlalu besar (${formatBytes(file.size)}). Maksimum ${MAX_SIZE_MB}MB.`);
        return;
      }

      const session = getSession();
      if (!session) {
        setError("Sesi tidak ditemukan. Silakan login ulang.");
        return;
      }

      // Baca sebagai base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setIsUploading(true);
        setUploadedInfo(null);

        try {
          const res = await uploadGambar(session.token, {
            base64,
            fileName: file.name,
            mimeType: file.type,
            folder,
          });
          onUpload(res.url);
          setUploadedInfo({ name: file.name, size: formatBytes(file.size) });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Gagal upload gambar.");
          setPreview(currentUrl ?? null);
          setUploadedInfo(null);
        } finally {
          setIsUploading(false);
        }
      };
    },
    [folder, onUpload, currentUrl]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  return (
    <div className="image-upload">
      <div className="image-upload-header">
        <p className="form-label">{label}</p>
        <span className="image-upload-info-badge">
          {ACCEPTED_EXT} · Maks. {MAX_SIZE_MB}MB
        </span>
      </div>

      {/* Drop zone */}
      <div
        className={[
          "image-upload-zone",
          isUploading ? "image-upload-zone--loading" : "",
          isDragging ? "image-upload-zone--dragging" : "",
        ].join(" ")}
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        aria-label="Klik atau seret & lepas gambar di sini"
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview gambar"
            className="image-upload-preview"
          />
        ) : (
          <div className="image-upload-placeholder">
            <div className="image-upload-placeholder-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p className="image-upload-placeholder-main">
              {isDragging ? "Lepaskan gambar di sini" : "Klik atau seret & lepas gambar"}
            </p>
            <p className="image-upload-placeholder-sub">
              Format: {ACCEPTED_EXT} · Ukuran maksimum: {MAX_SIZE_MB}MB
            </p>
            <p className="image-upload-placeholder-sub">
              Folder tujuan: <strong>{folder}</strong> di Google Drive
            </p>
          </div>
        )}

        {isUploading && (
          <div className="image-upload-overlay">
            <div className="admin-spinner" style={{ width: "2rem", height: "2rem" }} />
            <span className="text-sm text-white mt-3 font-medium">Mengupload ke Google Drive...</span>
            <span className="text-xs text-white/70 mt-1">Mohon tunggu, jangan tutup halaman ini</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={handleChange}
        tabIndex={-1}
      />

      {/* Upload success info */}
      {uploadedInfo && !isUploading && (
        <div className="image-upload-success">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-600 flex-shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-green-700">
            Upload berhasil: <strong>{uploadedInfo.name}</strong> ({uploadedInfo.size})
          </span>
        </div>
      )}

      {preview && !isUploading && (
        <button
          type="button"
          onClick={() => {
            setPreview(null);
            setUploadedInfo(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="image-upload-remove"
        >
          ✕ Hapus gambar
        </button>
      )}

      {error && (
        <div className="image-upload-error" role="alert">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
