"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn, formatBytes } from "@/lib/utils";

const ACCEPT = ".pdf,.doc,.docx,.png,.jpg,.jpeg";
const MAX_MB = 10;

export function UploadField({
  label,
  required,
  onChange,
}: {
  label: string;
  required?: boolean;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function handle(f: File | null) {
    setError(null);
    if (!f) {
      setFile(null);
      onChange(null);
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`Fichier trop volumineux (max ${MAX_MB} Mo).`);
      return;
    }
    setFile(f);
    onChange(f);
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-ink">
        {label}
        {required ? <span className="ml-0.5 text-ojid-orange">*</span> : null}
      </p>
      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-ojid-green/30 bg-ojid-green/5 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Icon name="FileCheck2" size={20} className="shrink-0 text-ojid-green" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{file.name}</p>
              <p className="text-xs text-muted">{formatBytes(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              handle(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-white hover:text-red-600"
            aria-label="Retirer le fichier"
          >
            <Icon name="Trash2" size={17} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handle(e.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            "flex w-full flex-col items-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
            dragOver
              ? "border-ojid-green bg-ojid-green/5"
              : "border-ojid-gray hover:border-ojid-green/50 hover:bg-ojid-gray/30",
          )}
        >
          <Icon name="Upload" size={22} className="text-ojid-green" />
          <span className="text-sm font-medium text-ink">
            Cliquez ou glissez un fichier
          </span>
          <span className="text-xs text-muted">PDF, DOC, DOCX, PNG, JPG - max {MAX_MB} Mo</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0] ?? null)}
      />
      {error ? <p className="mt-1.5 text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
