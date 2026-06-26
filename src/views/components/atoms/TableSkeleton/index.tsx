type TableSkeletonProps = {
  columns: number;
  rows?: number;
  minWidthClassName?: string;
  showToolbar?: boolean;
};

function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-md bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100",
        className,
      ].join(" ")}
    />
  );
}

export default function TableSkeleton({
  columns,
  rows = 6,
  minWidthClassName = "min-w-[760px]",
  showToolbar = true,
}: TableSkeletonProps) {
  return (
    <section
      aria-label="Memuat tabel"
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      {showToolbar ? (
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <SkeletonLine className="h-4 w-40" />
            <SkeletonLine className="mt-2 h-3 w-64 max-w-full" />
          </div>
          <SkeletonLine className="h-9 w-32 rounded-lg" />
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table
          className={[
            "w-full border-collapse text-left text-sm",
            minWidthClassName,
          ].join(" ")}
        >
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-5 py-3">
                  <SkeletonLine
                    className={[
                      "h-3",
                      index === 0 ? "w-8" : "",
                      index === columns - 1 ? "ml-auto w-14" : "",
                      index !== 0 && index !== columns - 1 ? "w-24" : "",
                    ].join(" ")}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((__, columnIndex) => (
                  <td key={columnIndex} className="px-5 py-4">
                    {columnIndex === columns - 1 ? (
                      <div className="flex justify-end gap-2">
                        <SkeletonLine className="h-8 w-8 rounded-md" />
                        <SkeletonLine className="h-8 w-8 rounded-md" />
                      </div>
                    ) : (
                      <SkeletonLine
                        className={[
                          "h-4",
                          columnIndex === 0 ? "w-8" : "",
                          columnIndex === 1 ? "w-44" : "",
                          columnIndex === 2 ? "w-36" : "",
                          columnIndex > 2 ? "w-28" : "",
                        ].join(" ")}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
