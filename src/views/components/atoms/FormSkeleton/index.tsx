type FormSkeletonProps = {
  fields?: number;
  columns?: 1 | 2;
  withWideField?: boolean;
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

export default function FormSkeleton({
  columns = 1,
  fields = 3,
  withWideField = false,
}: FormSkeletonProps) {
  return (
    <section
      aria-label="Memuat form"
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div
        className={[
          "grid gap-4",
          columns === 2 ? "lg:grid-cols-2" : "",
        ].join(" ")}
      >
        {Array.from({ length: fields }).map((_, index) => {
          const isWide = withWideField && index === 2;

          return (
            <div
              key={index}
              className={["space-y-2", isWide ? "lg:col-span-2" : ""].join(
                " ",
              )}
            >
              <SkeletonLine className="h-3 w-32" />
              <SkeletonLine className="h-11 w-full rounded-lg" />
              {index === fields - 1 ? (
                <SkeletonLine className="h-3 w-48 max-w-full" />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <SkeletonLine className="h-10 w-20 rounded-lg" />
        <SkeletonLine className="h-10 w-24 rounded-lg" />
      </div>
    </section>
  );
}
