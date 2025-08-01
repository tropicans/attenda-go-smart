import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, MapPin, FileSpreadsheet, Smartphone } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  const navigate = useNavigate(); // Hook untuk navigasi

  const features = [
    {
      icon: QrCode,
      title: 'QR Code',
      description: 'Scan & Generate'
    },
    {
      icon: MapPin,
      title: 'GPS Tracking',
      description: 'Lokasi Presisi'
    },
    {
      icon: FileSpreadsheet,
      title: 'Export Excel',
      description: 'Laporan Lengkap'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Akses Dimana Saja'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 py-16 sm:py-20 lg:py-32">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Presensi{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Modern
              </span>{' '}
              untuk ASN
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Solusi digital untuk presensi online & offline dengan QR Code, GPS tracking, 
              dan laporan otomatis yang mudah digunakan.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in">
            {/* Tombol ini sekarang akan mengarahkan ke halaman pilihan */}
            <Button 
              className="text-base sm:text-lg px-8 py-4" 
              size="lg"
              onClick={() => navigate('/attendance-options')}
            >
              <QrCode className="w-5 h-5 mr-2" />
              Mulai Presensi Sekarang
            </Button>
            <Button variant="outline" className="text-base sm:text-lg px-8 py-4 bg-white/80 hover:bg-white">
              <FileSpreadsheet className="w-5 h-5 mr-2" />
              Lihat Demo
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-feature text-center animate-fade-in p-4"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl mb-3 shadow-md">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Attribution */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              dibuat-buat oleh Yudhi © 2025
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float hidden md:block" />
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-secondary/20 rounded-full animate-float hidden md:block" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-20 w-12 h-12 bg-accent/20 rounded-full animate-float hidden md:block" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default Hero;
