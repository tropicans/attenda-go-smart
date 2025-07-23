import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  MapPin, 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Download
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Presensi Hari Ini',
      value: '147',
      change: '+12%',
      icon: Users,
      color: 'primary'
    },
    {
      title: 'Event Aktif',
      value: '8',
      change: '+3',
      icon: Calendar,
      color: 'secondary'
    },
    {
      title: 'QR Code Generated',
      value: '23',
      change: '+5',
      icon: QrCode,
      color: 'accent'
    },
    {
      title: 'Tingkat Kehadiran',
      value: '94.2%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'primary'
    }
  ];

  const recentActivity = [
    {
      name: 'Ahmad Supardi',
      action: 'Check-in via QR Code',
      time: '2 menit lalu',
      status: 'success',
      location: 'Gedung A - Lantai 2'
    },
    {
      name: 'Siti Nurhaliza',
      action: 'Check-in via GPS',
      time: '5 menit lalu',
      status: 'success',
      location: 'Kantor Pusat'
    },
    {
      name: 'Budi Santoso',
      action: 'Presensi Terlambat',
      time: '15 menit lalu',
      status: 'warning',
      location: 'Gedung B - Lantai 1'
    }
  ];

  const quickActions = [
    {
      title: 'Generate QR Code',
      description: 'Buat QR code untuk event baru',
      icon: QrCode,
      action: 'Buat QR'
    },
    {
      title: 'Presensi GPS',
      description: 'Check-in menggunakan lokasi',
      icon: MapPin,
      action: 'Check-in'
    },
    {
      title: 'Export Laporan',
      description: 'Download data presensi',
      icon: Download,
      action: 'Export'
    }
  ];

  return (
    <section className="py-20 bg-muted/30" id="dashboard">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Dashboard attenda
          </h2>
          <p className="text-xl text-muted-foreground">
            Kelola dan pantau semua aktivitas presensi dalam satu tempat
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
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
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    {stat.change}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Aktivitas Terkini</span>
                </CardTitle>
                <CardDescription>
                  Presensi terbaru dalam 30 menit terakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
                    >
                      <div className={`p-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {activity.status === 'success' ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> :
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.name}</p>
                        <p className="text-xs text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.location}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Akses cepat fitur utama
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button 
                    key={action.title}
                    variant="outline" 
                    className="w-full justify-start h-auto p-4 hover:bg-primary/5 border-border"
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
  );
};

export default Dashboard;