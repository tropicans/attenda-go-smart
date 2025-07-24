import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = () => {
  const { session, loading } = useAuth();
  const location = useLocation(); // 1. Dapatkan lokasi saat ini

  if (loading) {
    return null; // Atau tampilkan spinner
  }

  if (!session) {
    // 2. Saat mengalihkan, kirim lokasi asal ke halaman login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
