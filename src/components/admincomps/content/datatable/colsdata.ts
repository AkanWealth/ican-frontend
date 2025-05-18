export type Content = {
  id: string;
  title: string;
  category?:
    | "adverts"
    | "blogs"
    | "publication"
    | "gallery"
    | "technical"
    | "student"
    | "faq";
  author?: string;
  advertiser?: string;
  date_created?: string;
  start_date?: string;
  end_date?: string;
  materials?: string;
  status: "published" | "draft" | "hidden" | "expired" | "pending";
  published_date?: string;
  content?: string;
};



