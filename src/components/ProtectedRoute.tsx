import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  // Jika masih dalam proses loading, jangan render apa-apa
  // Ini untuk mencegah "kedipan" ke halaman login saat aplikasi pertama kali dimuat
  if (loading) {
    return null; // Atau tampilkan spinner loading halaman penuh
  }

  // Jika tidak ada sesi (belum login), alihkan ke halaman login
  if (!session) {
    return <Navigate to="/login" />;
  }

  // Jika sudah login, tampilkan halaman yang diminta
  // <Outlet /> adalah placeholder untuk halaman anak (misal: EventsPage, EmployeesPage)
  return <Outlet />;
};

export default ProtectedRoute;
