import { Search } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-warmgray-100 flex items-center justify-center mb-5">
        {icon || <Search className="w-7 h-7 text-warmgray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-warmgray-900 mb-1.5">{title}</h3>
      <p className="text-sm text-warmgray-500 max-w-sm mb-6">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-warm"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
