import { getRaffleStats } from "./actions";
import RaffleManager from "./RaffleManager";

export default async function AdminRafflePage() {
  const stats = await getRaffleStats();
  return <RaffleManager initialStats={stats} />;
}
