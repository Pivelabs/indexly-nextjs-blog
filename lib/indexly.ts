const API_BASE_URL = "https://app.indexly.ai";

export interface IndexlyCMSConfig {
  apiKey: string;
  apiBaseUrl?: string;
  pagination?: boolean;
  siteId?: string;
  page?: number;
  limit?: number;
}

export async function fetchPosts({
  apiKey,
  apiBaseUrl = API_BASE_URL,
  pagination = true,
  siteId,
  page = 1,
  limit = 9,
}: IndexlyCMSConfig) {
  const endpoint = pagination
    ? `${apiBaseUrl}/api/v1/content?pagination=true&page=${page}&limit=${limit}&siteId=${siteId ?? ""}`
    : `${apiBaseUrl}/api/v1/content?siteId=${siteId ?? ""}`;

  const res = await fetch(endpoint, {
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch posts:", res.status);

    return pagination
      ? {
          data: [],
          pagination: {
            page: 1,
            limit,
            total: 0,
            pages: 0,
          },
        }
      : [];
  }

  const json = await res.json();

  if (!pagination) {
    return json.data ?? [];
  }

  return {
    data: json.data ?? [],
    pagination: json.pagination ?? {
      page,
      limit,
      total: 0,
      pages: 1,
    },
  };
}

export async function fetchPostDetails(
  apiKey: string,
  identifier: string,
  apiBaseUrl: string = API_BASE_URL,
  siteId?: string,
) {
  const isObjectId = /^[a-f\d]{24}$/i.test(identifier);

  const endpoint = new URL("/api/v1/content", apiBaseUrl);
  endpoint.searchParams.set(
    isObjectId ? "id" : "slug",
    isObjectId ? identifier : decodeURIComponent(identifier),
  );

  if (siteId) {
    endpoint.searchParams.set("siteId", siteId);
  }

  const res = await fetch(endpoint, {
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch post:", res.status);
    return null;
  }

  const json = await res.json();
  return json.data ?? null;
}
