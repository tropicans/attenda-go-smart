import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import semua halaman
import IndexPage from './pages/Index';
import AttendPage from './pages/Attend';
import ScannerPage from './pages/Scanner';
import LoginPage from './pages/Login';
import EventsPage from './pages/admin/Events';
import EmployeesPage from './pages/admin/Employees';
import ReportsPage from './pages/admin/Reports';
import AttendanceOptionsPage from './pages/AttendanceOptions'; // Halaman baru

function App() {
  return (
    <Routes>
      {/* Rute-rute publik yang berdiri sendiri */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/attend/:eventId" element={<AttendPage />} />
      <Route path="/attendance-options" element={<AttendanceOptionsPage />} />
      <Route path="/attend-manual" element={<AttendPage />} />

      {/* Rute-rute yang menggunakan MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<IndexPage />} />
        
        {/* Rute yang dilindungi untuk admin */}
        <Route element={<ProtectedRoute />}>
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/admin/events" element={<EventsPage />} />
          <Route path="/admin/employees" element={<EmployeesPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App;
