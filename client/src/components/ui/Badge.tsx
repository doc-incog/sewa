const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  confirmed: "bg-sky-100 text-sky-800 ring-1 ring-sky-200",
  in_progress: "bg-violet-100 text-violet-800 ring-1 ring-violet-200",
  completed: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
  cancelled: "bg-red-100 text-red-800 ring-1 ring-red-200",
  active: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
  inactive: "bg-warmgray-100 text-warmgray-600 ring-1 ring-warmgray-200",
  verified: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
  unverified: "bg-warmgray-100 text-warmgray-600 ring-1 ring-warmgray-200",
  paid: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
  unpaid: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  failed: "bg-red-100 text-red-800 ring-1 ring-red-200",
};

interface BadgeProps {
  status: string;
  className?: string;
}

export default function Badge({ status, className = "" }: BadgeProps) {
  const style = statusStyles[status] || "bg-warmgray-100 text-warmgray-600 ring-1 ring-warmgray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${style} ${className}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
