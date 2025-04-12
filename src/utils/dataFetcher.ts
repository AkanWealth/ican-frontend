import { Event, events } from "@/components/admincomps/event/datatable/colsdata";

export async function getData(): Promise<Event[]> {
  return events;
}