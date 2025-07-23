import { QrCode, Heart } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  const links = [
    {
      title: 'Fitur',
      items: [
        { label: 'QR Code Scanner', href: '#scanner' },
        { label: 'GPS Tracking', href: '#gps' },
        { label: 'Dashboard', href: '#dashboard' },
        { label: 'Export Excel', href: '#export' }
      ]
    },
    {
      title: 'Dukungan',
      items: [
        { label: 'Panduan Penggunaan', href: '#guide' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Kontak Support', href: '#contact' },
        { label: 'WhatsApp Integration', href: '#whatsapp' }
      ]
    },
    {
      title: 'Teknologi',
      items: [
        { label: 'Next.js', href: 'https://nextjs.org' },
        { label: 'Supabase', href: 'https://supabase.com' },
        { label: 'n8n Webhook', href: '#webhook' },
        { label: 'Lovable.dev', href: 'https://lovable.dev' }
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-primary/5 to-secondary/5 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="attenda" className="w-10 h-10" />
              <div>
                <h3 className="text-xl font-bold text-foreground">attenda</h3>
                <p className="text-sm text-muted-foreground">Presensi Modern</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Solusi digital untuk presensi online & offline yang mudah, akurat, dan efisien 
              untuk ASN dan organisasi modern.
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>dibuat-buat dengan</span>
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
              <span>oleh Yudhi © 2025</span>
            </div>
          </div>

          {/* Links */}
          {links.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <a 
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4 md:mb-0">
              <span>Webhook: localhost:5678/webhook/f0bba257-9e63-44b2-b129-8e054a9ddaf3</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <QrCode className="w-4 h-4" />
                <span>Powered by Modern Tech Stack</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;