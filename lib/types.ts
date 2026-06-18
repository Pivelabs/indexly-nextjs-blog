export interface Post {
    id: string;
    title: string;
    slug: string;
    date: string;
    modified: string;
    excerpt: string;
    content: string;
    featuredImage: {
      url: string;
      alt: string;
      width?: number;
      height?: number;
    };
    categories: Category[];
    tags: Tag[];
    author: Author;
    readingTime: number;
    url: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    count?: number;
  }
  
  export interface Tag {
    id: string;
    name: string;
    slug: string;
    count?: number;
  }
  
  export interface Author {
    id: string;
    name: string;
    slug: string;
    avatar: {
      url: string;
    };
    bio: string;
    title: string;
  }
  
  export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }
  
  export interface BlogSettings {
    title: string;
    description: string;
    logo?: {
      url: string;
      alt: string;
    };
    socialLinks?: {
      twitter?: string;
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      youtube?: string;
    };
  }