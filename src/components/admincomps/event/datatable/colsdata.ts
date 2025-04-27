export interface Event {
  event_id: string;
  eventName: string;
  date: string;
  time: string;
  venue: "virtual" | string;
  meetingLink?: string;
  fee: number | string;
  mcpdCredit: "" | number;
  eventDescription?: string;
  eventImage?: string;
  status: "completed" | "cancelled" | "draft" | "upcoming";
}


