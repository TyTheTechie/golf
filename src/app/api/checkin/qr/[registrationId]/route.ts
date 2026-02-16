import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  const { registrationId } = await params;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const checkInUrl = `${baseUrl}/admin/checkin?id=${registrationId}`;

  const qrPng = await QRCode.toBuffer(checkInUrl, {
    width: 300,
    margin: 2,
    color: { dark: "#2d6a2d", light: "#ffffff" },
  });

  const arrayBuf = qrPng.buffer.slice(qrPng.byteOffset, qrPng.byteOffset + qrPng.byteLength) as ArrayBuffer;
  return new Response(arrayBuf, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
