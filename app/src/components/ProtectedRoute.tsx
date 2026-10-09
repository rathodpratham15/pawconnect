import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getUser, isLoggedIn } from '../auth';

interface ProtectedRouteProps {
  roles?: string[];
}

// Redirects anonymous visitors to /login (remembering where they wanted to go)
// and users without the required role to the home page.
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const user = getUser();
  if (roles && (!user || !roles.includes(user.role))) {
    return <Navigate to="/homepage" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
