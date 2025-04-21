import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser || !adminEmails.includes(currentUser.email || '')) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminRoute; 