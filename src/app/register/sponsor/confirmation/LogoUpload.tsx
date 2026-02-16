"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle, Image } from "lucide-react";

export default function LogoUpload({ sponsorId }: { sponsorId: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError(null);

    const allowed = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
    if (!allowed.includes(selected.type)) {
      setError("Please select a PNG, JPG, SVG, or WebP file.");
      return;
    }

    if (selected.size > 2 * 1024 * 1024) {
      setError("File must be under 2MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sponsorId", sponsorId);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      setUploadedUrl(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (uploadedUrl) {
    return (
      <div className="bg-card-bg border border-card-border rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="text-accent" size={24} />
        </div>
        <p className="font-medium text-foreground mb-3">Logo Uploaded</p>
        <img
          src={uploadedUrl}
          alt="Company logo"
          className="max-h-24 mx-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-6">
      <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
        <Image size={18} className="text-gold" />
        Upload Your Logo
      </h3>
      <p className="text-sm text-muted mb-4">
        Your logo will be displayed on the event website. You can skip this and
        contact an admin to upload later.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {!preview ? (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-card-border rounded-xl p-8 text-center hover:border-gold/50 hover:bg-gold/5 transition-colors cursor-pointer"
        >
          <Upload size={28} className="mx-auto mb-2 text-muted" />
          <p className="text-sm text-muted">
            Click to browse
          </p>
          <p className="text-xs text-muted/70 mt-1">
            PNG, JPG, SVG, or WebP (max 2MB)
          </p>
        </button>
      ) : (
        <div className="space-y-3">
          <div className="border border-card-border rounded-xl p-4 flex items-center justify-center bg-muted-bg">
            <img
              src={preview}
              alt="Logo preview"
              className="max-h-24 object-contain"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setFile(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="flex-1 px-4 py-2 border border-card-border rounded-lg text-sm text-muted hover:bg-muted-bg transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Logo"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}
