"use client";

import { useState, useRef, useCallback } from "react";
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

export default function ImageUpload({
  currentUrl,
  folder,
  onUpload,
  label = "Gambar",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Ukuran file melebihi batas ${MAX_SIZE_MB}MB.`);
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

        try {
          const res = await uploadGambar(session.token, {
            base64,
            fileName: file.name,
            mimeType: file.type,
            folder,
          });
          onUpload(res.url);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Gagal upload gambar.");
          setPreview(currentUrl ?? null);
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
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="image-upload">
      <p className="form-label">{label}</p>

      {/* Drop zone */}
      <div
        className={`image-upload-zone ${isUploading ? "image-upload-zone--loading" : ""}`}
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        role="button"
        tabIndex={0}
        aria-label="Klik atau drop gambar di sini"
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-primary-100 mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p className="text-sm text-text-muted">Klik atau drop gambar</p>
            <p className="text-xs text-text-muted mt-1">Maks. {MAX_SIZE_MB}MB</p>
          </div>
        )}

        {isUploading && (
          <div className="image-upload-overlay">
            <div className="admin-spinner" />
            <span className="text-sm text-white mt-2">Mengupload...</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
        tabIndex={-1}
      />

      {preview && !isUploading && (
        <button
          type="button"
          onClick={() => {
            setPreview(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="image-upload-remove"
        >
          Hapus gambar
        </button>
      )}

      {error && (
        <p className="form-error" role="alert">{error}</p>
      )}
    </div>
  );
}
