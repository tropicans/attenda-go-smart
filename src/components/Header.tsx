import { Link, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { QrCode, LayoutDashboard, Users, FileText, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // 1. Import useAuth
import { supabase } from '@/lib/supabaseClient';

const Header = () => {
  const { session } = useAuth(); // 2. Dapatkan sesi dari context
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // Arahkan ke halaman utama setelah logout
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Grup Kiri: Logo & Navigasi Utama */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <img src="/src/assets/logo.png" alt="attenda logo" className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">attenda</h1>
                <p className="text-xs text-muted-foreground">Presensi Modern</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Fitur
              </a>
              <a href="/#dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </a>
            </nav>
          </div>

          {/* Grup Kanan: Tombol Aksi (Dinamis) */}
          <div className="flex items-center space-x-2">
            {/* 3. Gunakan conditional rendering */}
            {session ? (
              <> {/* Tampilkan ini jika sudah login */}
                <Button variant="ghost" asChild>
                  <Link to="/admin/events">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Event
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/admin/employees">
                    <Users className="mr-2 h-4 w-4" />
                    Pegawai
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/admin/reports">
                    <FileText className="mr-2 h-4 w-4" />
                    Laporan
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <> {/* Tampilkan ini jika belum login */}

                <Button asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Admin Login
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
