import { getPromoCodes } from "./actions";
import PromoManager from "./PromoManager";

export default async function AdminPromosPage() {
  const promos = await getPromoCodes();
  return <PromoManager initialPromos={promos} />;
}
