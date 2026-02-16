import { prisma } from "@/lib/prisma";
import PhotoManager from "./PhotoManager";

export default async function AdminPhotosPage() {
  const photos = await prisma.photo.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Photo Gallery</h1>
      <PhotoManager initialPhotos={photos} />
    </div>
  );
}
