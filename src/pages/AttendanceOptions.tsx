import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Edit } from 'lucide-react';

const AttendanceOptionsPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Pilih Metode Presensi</CardTitle>
          <CardDescription>
            Anda dapat melakukan presensi dengan memindai QR code atau mengisi data secara manual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link to="/scanner">
              <QrCode className="mr-2 h-5 w-5" />
              Pindai QR Code Pegawai
            </Link>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Atau
              </span>
            </div>
          </div>
          <Button asChild className="w-full" size="lg" variant="outline">
            <Link to="/attend-manual">
              <Edit className="mr-2 h-5 w-5" />
              Isi Manual
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceOptionsPage;
