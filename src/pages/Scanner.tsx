import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, ArrowLeft } from 'lucide-react';

const ScannerPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <QrCode className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">Fitur QR Scanner</CardTitle>
          <CardDescription>
            Fitur ini sedang dalam pengembangan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Halaman ini nantinya akan berisi antarmuka untuk memindai QR code presensi secara langsung dari aplikasi.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Anda mungkin perlu menambahkan komponen Card ini jika belum ada secara global
// Biasanya diletakkan di file terpisah, tapi untuk sementara kita letakkan di sini.
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
);

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
);

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props} />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);


export default ScannerPage;
