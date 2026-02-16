"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyInviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <code className="flex-1 px-4 py-2.5 bg-white border border-amber-300 rounded-lg font-mono text-lg tracking-wider text-foreground text-center">
        {code}
      </code>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors text-sm"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
