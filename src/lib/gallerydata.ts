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
    title: "54th Annual Accountants Conference",
    date: "",
    imageUrl: "/gallery/Gallery-1.png",
    galleryContent: {
      subtitle: "",
      content:
        "",
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
    category: "Meetings",
    title: "September Monthly Meeting",
    date: "",
    imageUrl: "/month/mm (1).jpg",
    galleryContent: {
      subtitle: "Monthly Meeting Highlights",
      content:
        "",
      galleryImages: [
        "/month/mm (1).jpg",
        "/month/mm (2).jpg",
        "/month/mm (3).jpg",
        "/month/mm (4).jpg",
        "/month/mm (5).jpg",
        "/month/mm (6).jpg",
        "/month/mm (7).jpg",
        "/month/mm (8).jpg",
        "/month/mm (9).jpg",
      ],
    },
  },
  // Add more gallery items as needed
];
