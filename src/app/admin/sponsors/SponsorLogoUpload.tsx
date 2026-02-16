"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";

export default function SponsorLogoUpload({
  sponsorId,
  currentLogoUrl,
}: {
  sponsorId: string;
  currentLogoUrl: string | null;
}) {
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sponsorId", sponsorId);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setLogoUrl(data.url + "?" + Date.now()); // cache-bust
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Sponsor logo"
          className="h-8 w-14 object-contain rounded cursor-pointer hover:opacity-75 transition-opacity"
          onClick={() => fileRef.current?.click()}
          title="Click to replace"
        />
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1 px-2 py-1 text-xs border border-card-border rounded hover:bg-muted-bg transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Upload size={12} />
          )}
          Upload
        </button>
      )}

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
