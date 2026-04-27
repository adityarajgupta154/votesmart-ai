/**
 * PageLoader — Accessible loading spinner for route transitions.
 * Uses role="status" and aria-live="polite" for screen reader announcements.
 */
export default function PageLoader() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]" role="status" aria-live="polite">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#8b5e34] rounded-full animate-spin" aria-hidden="true"></div>
      <span className="sr-only">Loading page...</span>
    </div>
  );
}
