export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gray-200/70 dark:bg-slate-700 ${className}`}
    />
  );
}
