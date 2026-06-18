// components/loading.tsx
export function PostCardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="aspect-video bg-gray-300 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export function BlogPageLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="h-8 bg-gray-300 rounded w-64 mx-auto animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
      </div>
      
      <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
