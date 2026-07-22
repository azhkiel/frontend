"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  isDangerous = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal aria-labelledby="dialog-title">
      <div className="dialog-panel">
        <div className="dialog-icon-wrap">
          <div className={`dialog-icon ${isDangerous ? "dialog-icon--danger" : "dialog-icon--info"}`}>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <h2 id="dialog-title" className="dialog-title">{title}</h2>
        <p className="dialog-message">{message}</p>

        <div className="dialog-actions">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="admin-btn admin-btn--ghost"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`admin-btn ${isDangerous ? "admin-btn--danger" : "admin-btn--primary"}`}
          >
            {isLoading ? "Menghapus..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
