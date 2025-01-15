export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  date: string;
  imageUrl: string;
  galleryContent: {
    subtitle: string;
    content: string;
    galleryImages: string[]; // Array of additional gallery images
  };
}

// Example gallery items
export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    category: "Events",
    title: "ICAN Award & Dinner",
    date: "22, October 2024",
    imageUrl: "/gallery/Gallery-1.png",
    galleryContent: {
      subtitle: "A Night to Remember",
      content:
        "The ICAN Award & Dinner was a night filled with celebration and recognition of outstanding achievements...",
      galleryImages: [
        "/gallery/Gallery-1.png",
        "/gallery/Gallery-2.png",
        "/gallery/Gallery-3.png",
        "/gallery/Gallery-4.png",
        "/gallery/Gallery-5.png",
        "/gallery/Gallery-6.png",
        "/gallery/Gallery-7.png",
        "/gallery/Gallery-8.png",
        "/gallery/Gallery-9.png",
      ],
    },
  },
  {
    id: "2",
    category: "Workshops",
    title: "Financial Literacy Workshop",
    date: "15, November 2024",
    imageUrl: "/gallery/Gallery-2.png",
    galleryContent: {
      subtitle: "Empowering Financial Knowledge",
      content:
        "Our Financial Literacy Workshop provided valuable insights and practical tips on managing personal finances...",
      galleryImages: [
        "/gallery/Gallery-1.png",
        "/gallery/Gallery-2.png",
        "/gallery/Gallery-3.png",
        "/gallery/Gallery-4.png",
        "/gallery/Gallery-5.png",
        "/gallery/Gallery-6.png",
        "/gallery/Gallery-7.png",
        "/gallery/Gallery-8.png",
        "/gallery/Gallery-9.png",
      ],
    },
  },
  // Add more gallery items as needed
];
