import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  MapPin, 
  Users, 
  Calendar, 
  User, 
  Clock,
  CheckCircle,
  Download
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import GenerateQrModal from './GenerateQrModal'; // 1. Import komponen modal

// Definisikan tipe untuk data aktivitas
interface RecentActivity {
  id: number;
  created_at: string;
  employees: {
    name: string;
  } | null;
}

const Dashboard = () => {
  // State untuk menyimpan data statistik
  const [stats, setStats] = useState({
    totalPresensiHariIni: 0,
    eventAktif: 0,
    totalPegawai: 0,
  });
  
  // State untuk menyimpan data aktivitas terkini
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false); // 2. State untuk mengontrol modal

  // useEffect untuk mengambil data dari Supabase saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const { count: presensiCount } = await supabase
        .from('attendees')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO);

      const { count: eventCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('event_date', today.toISOString().split('T')[0]);

      const { count: pegawaiCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });

      const { data: activityData } = await supabase
        .from('attendees')
        .select(`
          id,
          created_at,
          employees ( name )
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      setStats({
        totalPresensiHariIni: presensiCount ?? 0,
        eventAktif: eventCount ?? 0,
        totalPegawai: pegawaiCount ?? 0,
      });
      setRecentActivity(activityData as RecentActivity[] ?? []);
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " menit lalu";
    }
    return Math.floor(seconds) + " detik lalu";
  };

  const statCards = [
    {
      title: 'Total Presensi Hari Ini',
      value: stats.totalPresensiHariIni.toString(),
      icon: Users,
      color: 'primary'
    },
    {
      title: 'Event Aktif',
      value: stats.eventAktif.toString(),
      icon: Calendar,
      color: 'secondary'
    },
    {
      title: 'Total Pegawai',
      value: stats.totalPegawai.toString(),
      icon: User,
      color: 'accent'
    },
  ];

  // 3. Definisikan aksi untuk tombol
  const quickActions = [
    {
      title: 'Generate QR Code',
      description: 'Buat QR code untuk event baru',
      icon: QrCode,
      onClick: () => setIsQrModalOpen(true) // Buka modal saat diklik
    },
    {
      title: 'Presensi GPS',
      description: 'Check-in menggunakan lokasi',
      icon: MapPin,
      onClick: () => alert('Fitur Presensi GPS akan segera hadir!')
    },
    {
      title: 'Export Laporan',
      description: 'Download data presensi',
      icon: Download,
      onClick: () => alert('Fitur Export Laporan akan segera hadir!')
    }
  ];

  return (
    <> {/* 4. Bungkus dengan Fragment */}
      <section className="py-20 bg-muted/30" id="dashboard">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Dashboard attenda
            </h2>
            <p className="text-xl text-muted-foreground">
              Kelola dan pantau semua aktivitas presensi dalam satu tempat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="card-elevated">
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-8 rounded-xl mb-4" />
                    <Skeleton className="h-8 w-1/4 mb-1" />
                    <Skeleton className="h-5 w-3/4" />
                  </CardContent>
                </Card>
              ))
            ) : (
              statCards.map((stat, index) => (
                <Card 
                  key={stat.title} 
                  className="card-elevated animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-${stat.color}/10 rounded-xl`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Aktivitas Terkini</span>
                  </CardTitle>
                  <CardDescription>
                    Presensi terbaru yang masuk
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                         <div key={index} className="flex items-center space-x-4 p-4">
                           <Skeleton className="h-8 w-8 rounded-full" />
                           <div className="flex-1 space-y-1">
                             <Skeleton className="h-4 w-1/2" />
                             <Skeleton className="h-3 w-1/3" />
                           </div>
                           <Skeleton className="h-3 w-1/4" />
                         </div>
                      ))
                    ) : (
                      recentActivity.map((activity) => (
                        <div 
                          key={activity.id}
                          className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
                        >
                          <div className="p-2 rounded-full bg-green-100">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{activity.employees?.name ?? 'Peserta Eksternal'}</p>
                            <p className="text-xs text-muted-foreground">Check-in berhasil</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTimeAgo(activity.created_at)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Akses cepat fitur utama
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action) => (
                    <Button 
                      key={action.title}
                      variant="outline" 
                      className="w-full justify-start h-auto p-4 hover:bg-primary/5 border-border"
                      onClick={action.onClick} // 5. Tambahkan onClick handler
                    >
                      <div className="flex items-center space-x-3 text-left">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <action.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* 6. Render komponen modal di sini */}
      <GenerateQrModal 
        isOpen={isQrModalOpen} 
        onClose={() => setIsQrModalOpen(false)} 
      />
    </>
  );
};

export default Dashboard;
