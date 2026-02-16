import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";

export default async function GalleryPage() {
  const photos = await prisma.photo.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12 pt-24">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Camera className="text-accent" size={32} />
            Photo Gallery
          </h1>
          <p className="text-muted mt-1">
            Memories from our golf tournaments
          </p>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-20">
            <Camera size={48} className="text-muted/30 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-foreground mb-2">
              No Photos Yet
            </h2>
            <p className="text-muted">
              Photos will be added here during and after the event.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-muted-bg"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || "Event photo"}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-sm">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
