import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, MapPin, FileSpreadsheet, Users, Shield, MessageSquare, PenTool, UserCheck } from 'lucide-react';

const Features = () => {
  const primaryFeatures = [
    {
      icon: QrCode,
      title: 'QR Code Dinamis',
      description: 'Generate dan scan QR code yang terhubung langsung ke halaman acara',
      color: 'primary'
    },
    {
      icon: MapPin,
      title: 'GPS Tracking',
      description: 'Presensi offline dengan verifikasi lokasi yang akurat',
      color: 'secondary'
    },
    {
      icon: FileSpreadsheet,
      title: 'Export Excel',
      description: 'Laporan presensi lengkap yang dapat diekspor ke Excel',
      color: 'accent'
    },
    {
      icon: Users,
      title: 'Dashboard Lengkap',
      description: 'Kelola semua data presensi dalam satu tempat',
      color: 'primary'
    }
  ];

  const advancedFeatures = [
    {
      icon: UserCheck,
      title: 'Otomatisasi NIP',
      description: 'Integrasi data internal ASN via NIP dengan konfirmasi WhatsApp',
      badge: 'Advanced'
    },
    {
      icon: PenTool,
      title: 'Tanda Tangan Digital',
      description: 'Validasi presensi dengan tanda tangan digital yang aman',
      badge: 'Advanced'
    },
    {
      icon: MessageSquare,
      title: 'Notifikasi WhatsApp',
      description: 'Konfirmasi otomatis via WhatsApp untuk setiap presensi',
      badge: 'Advanced'
    },
    {
      icon: Shield,
      title: 'Form Eksternal',
      description: 'Formulir khusus untuk peserta eksternal: nama, email, instansi',
      badge: 'Advanced'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fitur Unggulan attenda
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Solusi presensi yang lengkap dan modern untuk memenuhi kebutuhan ASN dan organisasi
          </p>
        </div>

        {/* Primary Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {primaryFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="card-elevated group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 bg-${feature.color}/10 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 text-${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Advanced Features */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-full text-foreground font-semibold mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Fitur Advanced
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Automasi & Integrasi Canggih
            </h3>
            <p className="text-muted-foreground">
              Fitur lanjutan untuk optimalisasi workflow presensi organisasi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {advancedFeatures.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="border-0 bg-white/80 hover:bg-white hover:shadow-lg transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg">
                        <feature.icon className="w-5 h-5 text-foreground" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <span className="px-2 py-1 bg-gradient-to-r from-primary to-secondary text-xs font-medium rounded-full text-foreground">
                      {feature.badge}
                    </span>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;