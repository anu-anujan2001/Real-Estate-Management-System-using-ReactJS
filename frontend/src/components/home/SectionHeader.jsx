import { Link } from "react-router-dom";

export default function SectionHeader({
  title,
  subtitle,
  actionText,
  actionLink = "/",
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-base-content/70 mt-1 text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && (
        <Link
          to={actionLink}
          className="text-primary font-medium hover:underline"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
