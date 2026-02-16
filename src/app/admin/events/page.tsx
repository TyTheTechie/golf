import { getEvents } from "./actions";
import EventManager from "./EventManager";

export default async function AdminEventsPage() {
  const events = await getEvents();
  return <EventManager initialEvents={events} />;
}
