"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  deleteRegistration,
  deleteSponsor,
  deleteAuctionItem,
  deleteDonation,
} from "@/app/admin/actions";

const deleteActions = {
  registration: deleteRegistration,
  sponsor: deleteSponsor,
  auctionItem: deleteAuctionItem,
  donation: deleteDonation,
} as const;

export default function DeleteButton({
  id,
  type,
}: {
  id: string;
  type: keyof typeof deleteActions;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleClick() {
    if (!confirm("Are you sure you want to delete this? This cannot be undone.")) return;
    setDeleting(true);
    await deleteActions[type](id);
    router.refresh();
    setDeleting(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={deleting}
      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete"
    >
      <Trash2 size={14} />
    </button>
  );
}
