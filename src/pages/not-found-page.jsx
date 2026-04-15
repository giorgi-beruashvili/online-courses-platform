import { Link } from "react-router-dom";
import { ROUTES } from "../shared/constants/routes";

export function NotFoundPage() {
  return (
    <div className="section-card centered-card">
      <h1>Page Not Found</h1>
      <p>
        The page you are looking for does not exist or is no longer available.
      </p>

      <div className="button-row centered-row">
        <Link to={ROUTES.HOME} className="button button-primary">
          Go Back Home
        </Link>

        <Link to={ROUTES.COURSES} className="button button-secondary">
          Browse Courses
        </Link>
      </div>
    </div>
  );
}
