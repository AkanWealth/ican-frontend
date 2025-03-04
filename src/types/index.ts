/**
 * Represents a blog post object with details such as category, title, date, and content.
 */
export interface BlogPost {
  /** Unique identifier for the blog post */
  id: string;

  /** The category of the blog post */
  category: "Articles" | "News" | "Videos" ;

  /** Title of the blog post */
  title: string;

  /** Publication date of the blog post in string format */
  date: string;

  /** URL to the featured image of the blog post */
  imageUrl: string;

  /** Content details of the blog post */
  blogContent: {
    /** Subtitle of the blog post */
    subtitle: string;

    /** Main content of the blog post */
    content: string;
  };
}

export interface DownloadTile {
  /** Unique identifier for the download item */
  id: string;

  /** The category of the download item  */
  category: "Professional" | "Skills";

  /** Title of the download item */
  title: string;

  /** Filetype of the download item in string format */
  fileType: string;

  /** URL to the featured image of the blog post */
  imageUrl: string;

  /** Content details of the blog post */
  downloadLink: string;
}

export interface DownloadCardProps {
  /** The blog post data to be displayed */
  downloadItem: DownloadTile;
}

/**
 * Props for rendering a BlogCard component, which displays an individual blog post.
 */
export interface BlogCardProps {
  /** The blog post data to be displayed */
  post: BlogPost;

  /**
   * Callback function to handle the "Read More" action.
   * @param id - The unique identifier of the blog post
   */
  onReadMore: (id: string) => void;
}

/**
 * Props for a Pagination component to navigate through multiple pages of content.
 */
export interface PaginationProps {
  /** Current page number being displayed */
  currentPage: number;

  /**
   * Callback function triggered when the page changes.
   * @param page - The new page number to navigate to
   */
  onPageChange: (page: number) => void;

  /** Total number of posts that match the applied filters */
  totalFilteredPosts: number;
}

/**
 * Props for rendering an individual Tab component in a tab navigation system.
 */
export interface TabProps {
  /** Label text displayed on the tab */
  label: string;

  /** Indicates whether the tab is currently active */
  isActive: boolean;

  /** Callback function triggered when the tab is clicked */
  onClick: () => void;
}

/**
 * Props for a BlogTabs component that manages multiple tabs for blog post filtering.
 */
export interface BlogTabsProps {
  /** The currently active tab */
  activeTab: string;

  /**
   * Callback function triggered when the active tab changes.
   * @param tab - The new active tab
   */
  onTabChange: (tab: string) => void;
}
