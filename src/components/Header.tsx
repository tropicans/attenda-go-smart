import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, QrCode, BarChart3, Users, Settings } from 'lucide-react';
import logo from '@/assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { icon: QrCode, label: 'QR Scanner', href: '#scanner' },
    { icon: BarChart3, label: 'Dashboard', href: '#dashboard' },
    { icon: Users, label: 'Presensi', href: '#attendance' },
    { icon: Settings, label: 'Laporan', href: '#reports' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="attenda" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">attenda</h1>
              <p className="text-xs text-muted-foreground">Presensi Modern</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="btn-hero">
              Mulai Presensi
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
              <Button className="btn-hero mt-4">
                Mulai Presensi
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;