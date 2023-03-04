export default function NoteViewSkeleton() {
  return (
    <div className="container mx-auto px-10 md:px-20">
      <div className="flex flex-row justify-end py-2">
        <div className="flex flex-row gap-2">
          {/* Edit Button */}
          <div className="h-10 w-[100px] animate-pulse rounded-md bg-slate-500"></div>

          {/* Delete Button */}
          <div className="h-10 w-[100px] animate-pulse rounded-md bg-slate-500"></div>
        </div>
      </div>

      {/* Title */}
      <div className="h-12 w-full animate-pulse rounded-md bg-slate-500 py-2"></div>
      <hr className="mt-3 border-b-gray-500 opacity-50" />

      {/* Markdown Preview */}
      <div className="py-4">
        <div className="h-[500px] w-full animate-pulse rounded-md bg-slate-500"></div>
      </div>
    </div>
  );
}
