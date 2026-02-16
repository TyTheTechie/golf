"use client";

import { Download } from "lucide-react";

export default function ExportButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 px-4 py-2 border border-card-border rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-muted-bg transition-colors"
    >
      <Download size={16} />
      {label}
    </a>
  );
}
