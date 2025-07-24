import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/MainLayout'; // 1. Import layout utama
import ProtectedRoute from '@/components/ProtectedRoute';

// Import semua halaman
import IndexPage from './pages/Index';
import AttendPage from './pages/Attend';
import ScannerPage from './pages/Scanner';
import LoginPage from './pages/Login';
import EventsPage from './pages/admin/Events';
import EmployeesPage from './pages/admin/Employees';
import ReportsPage from './pages/admin/Reports';

function App() {
  return (
    <Routes>
      {/* Rute-rute yang berdiri sendiri (tanpa header utama) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/attend/:eventId" element={<AttendPage />} />

      {/* Rute-rute yang menggunakan MainLayout (memiliki header) */}
      <Route element={<MainLayout />}> {/* 2. Bungkus rute-rute ini dengan MainLayout */}
        <Route path="/" element={<IndexPage />} />
        <Route path="/scanner" element={<ScannerPage />} />

        {/* Rute admin di dalam MainLayout dan juga dilindungi */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/events" element={<EventsPage />} />
          <Route path="/admin/employees" element={<EmployeesPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
