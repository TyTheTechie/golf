"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import { getAuctionItemForEdit, updateAuctionItem } from "../../../actions";

export default function EditAuctionItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [bidIncrement, setBidIncrement] = useState("");
  const [endTime, setEndTime] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Image upload
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const result = await getAuctionItemForEdit(itemId);
      if (result.error || !result.item) {
        setError(result.error || "Item not found");
        setLoading(false);
        return;
      }
      const item = result.item;
      setTitle(item.title);
      setDescription(item.description);
      setStartingBid((item.startingBid / 100).toFixed(2));
      setBidIncrement((item.bidIncrement / 100).toFixed(2));
      setEndTime(item.endTime ? new Date(item.endTime).toISOString().slice(0, 16) : "");
      setCurrentImageUrl(item.imageUrl);
      setLoading(false);
    }
    load();
  }, [itemId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const result = await updateAuctionItem(itemId, {
      title,
      description,
      startingBid: Math.round(parseFloat(startingBid) * 100),
      bidIncrement: Math.round(parseFloat(bidIncrement) * 100),
      endTime: endTime || undefined,
    });

    if (result.error) {
      setError(result.error);
      setSaving(false);
    } else {
      router.push("/admin/auction");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setUploadError("");
    setUploadSuccess(false);

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
    if (!file) return;
    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "auction");
      formData.append("auctionItemId", itemId);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Upload failed");
        return;
      }

      setCurrentImageUrl(data.url);
      setPreview(null);
      setFile(null);
      setUploadSuccess(true);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center text-muted py-12">Loading...</div>
    );
  }

  if (error && !title) {
    return (
      <div>
        <Link
          href="/admin/auction"
          className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6"
        >
          <ArrowLeft size={16} /> Back to Auction
        </Link>
        <div className="bg-card-bg border border-card-border rounded-xl p-10 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/auction"
        className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6"
      >
        <ArrowLeft size={16} /> Back to Auction
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Auction Item</h1>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 max-w-2xl">
        {/* Details form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4"
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
            disabled={saving}
            className="w-full py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Image section */}
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Item Image</h2>

          {currentImageUrl && (
            <div className="mb-4 border border-card-border rounded-xl p-4 bg-muted-bg">
              <img
                src={currentImageUrl}
                alt="Current item image"
                className="max-h-48 mx-auto object-contain rounded"
              />
            </div>
          )}

          {uploadSuccess && (
            <div className="mb-3 flex items-center gap-2 text-sm text-green-700">
              <CheckCircle size={14} />
              Image updated successfully
            </div>
          )}

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
              className="w-full border-2 border-dashed border-card-border rounded-xl p-6 text-center hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-pointer"
            >
              <Upload size={24} className="mx-auto mb-2 text-muted" />
              <p className="text-sm text-muted">
                {currentImageUrl ? "Click to replace image" : "Click to upload an image"}
              </p>
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
                    setUploadSuccess(false);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="flex-1 px-4 py-2.5 border border-card-border rounded-lg text-sm text-muted hover:bg-muted-bg transition-colors"
                >
                  Cancel
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
      </div>
    </div>
  );
}
