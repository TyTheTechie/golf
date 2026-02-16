"use client";

import Image from "next/image";

export default function QRCodeDisplay({ registrationId }: { registrationId: string }) {
  const qrUrl = `/api/checkin/qr/${registrationId}`;

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-card-border">
      <Image
        src={qrUrl}
        alt="Check-in QR Code"
        width={150}
        height={150}
        className="rounded"
        unoptimized
      />
      <p className="text-xs text-muted font-mono">{registrationId.slice(0, 12)}...</p>
      <p className="text-xs text-muted">Show at check-in</p>
    </div>
  );
}
