interface LoadingDataTableProps {
    rows?: number;
    columns?: number;
  }

  const LoadingDataTable = ({ rows = 5, columns = 5 }: LoadingDataTableProps) => (
    <div className="w-full p-4 bg-transparent">
      <div className="animate-pulse space-y-4">
        {/* Table Header Skeleton */}
        <div className="flex items-center space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={`header-${index}`}
              className="h-6 flex-1 rounded bg-gray-300 dark:bg-gray-500/60"
            />
          ))}
        </div>

        {/* Table Rows Skeleton */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex items-center space-x-4 py-2"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-5 flex-1 rounded bg-gray-200 dark:bg-gray-600"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  export default LoadingDataTable;
