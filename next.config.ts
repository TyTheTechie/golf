import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sandbox.web.squarecdn.com https://web.squarecdn.com https://pay.google.com https://sand.cashapppay.com https://cashapppay.com",
              "style-src 'self' 'unsafe-inline' https://sandbox.web.squarecdn.com https://web.squarecdn.com",
              "frame-src 'self' https://sandbox.web.squarecdn.com https://web.squarecdn.com https://connect.squareupsandbox.com https://connect.squareup.com https://www.google.com https://pay.google.com https://sand.cashapppay.com https://cashapppay.com https://accounts.google.com",
              "connect-src 'self' https://sandbox.web.squarecdn.com https://web.squarecdn.com https://pci-connect.squareupsandbox.com https://pci-connect.squareup.com https://pay.google.com https://sand.cashapppay.com https://cashapppay.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' https://sandbox.web.squarecdn.com https://web.squarecdn.com https://square-fonts-production.squarecdn.com https://d1g145x70srn7h.cloudfront.net",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
