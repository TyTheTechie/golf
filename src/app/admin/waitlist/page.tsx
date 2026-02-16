import { getWaitlistEntries } from "./actions";
import WaitlistManager from "./WaitlistManager";

export default async function AdminWaitlistPage() {
  const entries = await getWaitlistEntries();
  return <WaitlistManager initialEntries={entries} />;
}
