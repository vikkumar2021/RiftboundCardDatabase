export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-1/3 mb-4" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-[2/3] bg-gray-800 rounded-lg" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-800 rounded w-1/2" />
            <div className="h-4 bg-gray-800 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
