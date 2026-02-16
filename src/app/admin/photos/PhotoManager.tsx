"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2, AlertCircle } from "lucide-react";
import { deletePhoto } from "./actions";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  sortOrder: number;
}

export default function PhotoManager({ initialPhotos }: { initialPhotos: Photo[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Please select a PNG, JPG, or WebP file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "photo");
    if (caption) formData.append("caption", caption);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        setCaption("");
        if (fileRef.current) fileRef.current.value = "";
        router.refresh();
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(photoId: string) {
    if (!confirm("Delete this photo?")) return;
    await deletePhoto(photoId);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Upload section */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Upload Photo</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>

      {/* Photos grid */}
      {initialPhotos.length === 0 ? (
        <p className="text-muted text-center py-12">No photos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {initialPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-muted-bg border border-card-border"
            >
              <img
                src={photo.url}
                alt={photo.caption || "Photo"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex items-end justify-between">
                <span className="text-white text-xs truncate">
                  {photo.caption || "No caption"}
                </span>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
