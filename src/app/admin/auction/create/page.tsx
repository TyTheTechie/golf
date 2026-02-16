"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle, AlertCircle, SkipForward } from "lucide-react";
import { createAuctionItem } from "../../actions";

export default function CreateAuctionItemPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("25.00");
  const [bidIncrement, setBidIncrement] = useState("5.00");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 2: Image upload
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await createAuctionItem({
      title,
      description,
      startingBid: Math.round(parseFloat(startingBid) * 100),
      bidIncrement: Math.round(parseFloat(bidIncrement) * 100),
      endTime: endTime || undefined,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.item) {
      setCreatedItemId(result.item.id);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setUploadError("");

    const allowed = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
    if (!allowed.includes(selected.type)) {
      setUploadError("Please select a PNG, JPG, SVG, or WebP file.");
      return;
    }
    if (selected.size > 2 * 1024 * 1024) {
      setUploadError("File must be under 2MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleUpload() {
    if (!file || !createdItemId) return;
    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "auction");
      formData.append("auctionItemId", createdItemId);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Upload failed");
        return;
      }

      router.push("/admin/auction");
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  // Step 2: Image upload UI
  if (createdItemId) {
    return (
      <div>
        <Link
          href="/admin/auction"
          className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6"
        >
          <ArrowLeft size={16} /> Back to Auction
        </Link>

        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
              <CheckCircle className="text-accent" size={18} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Item Created!</h1>
              <p className="text-sm text-muted">Now add an image (optional)</p>
            </div>
          </div>

          <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-4">
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
                className="w-full border-2 border-dashed border-card-border rounded-xl p-8 text-center hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-pointer"
              >
                <Upload size={28} className="mx-auto mb-2 text-muted" />
                <p className="text-sm text-muted">Click to select an image</p>
                <p className="text-xs text-muted/70 mt-1">PNG, JPG, SVG, or WebP (max 2MB)</p>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="border border-card-border rounded-xl p-4 flex items-center justify-center bg-muted-bg">
                  <img src={preview} alt="Preview" className="max-h-48 object-contain" />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setFile(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="flex-1 px-4 py-2.5 border border-card-border rounded-lg text-sm text-muted hover:bg-muted-bg transition-colors"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle size={14} />
                {uploadError}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/auction")}
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <SkipForward size={14} />
            Skip — go to auction list
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Create item form
  return (
    <div>
      <Link
        href="/admin/auction"
        className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6"
      >
        <ArrowLeft size={16} /> Back to Auction
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-6">Create Auction Item</h1>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-xl bg-card-bg border border-card-border rounded-xl p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Starting Bid ($) *</label>
            <input
              type="number"
              value={startingBid}
              onChange={(e) => setStartingBid(e.target.value)}
              required
              min="1"
              step="0.01"
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Bid Increment ($) *</label>
            <input
              type="number"
              value={bidIncrement}
              onChange={(e) => setBidIncrement(e.target.value)}
              required
              min="1"
              step="0.01"
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">End Time (optional)</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Auction Item"}
        </button>
      </form>
    </div>
  );
}
