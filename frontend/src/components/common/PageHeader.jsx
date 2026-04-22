import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  buttonText,
  buttonLink,
  showBack = false,
  backPath = null,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      {/* LEFT */}
      <div className="flex items-start gap-3">
        {showBack && (
          <button onClick={handleBack} className="btn btn-ghost btn-circle">
            <ArrowLeft size={20} />
          </button>
        )}

        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-sm md:text-base text-base-content/60 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      {buttonText && buttonLink && (
        <Link to={buttonLink} className="btn btn-primary">
          {buttonText}
        </Link>
      )}
    </div>
  );
}
