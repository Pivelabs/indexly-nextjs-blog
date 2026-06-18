export interface ContentPlanType {
  topic?: string | null
  primaryKeyword?: string | null
  secondaryKeyword?: string | null
  tone?: string | null
  objective?: string | null
  audience?: string | null
}

export type IndexlyPost = {
  id: string;

  topic?: string;
  selectedTitle?: string;

  excerpt?: string;

  heroImage?: string;

  content?: string;
  slug?: string;
  fullArticle?: string;

  primaryKeyword?: string;
  secondaryKeyword?: string;

  createdAt: string;
  updatedAt: string;

  isCompleted: boolean;
  isPublishedToCMS?: boolean;
};