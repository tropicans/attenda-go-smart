import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Toaster } from "@/components/ui/sonner";
import { Upload } from 'lucide-react';

// Tipe untuk data event
interface Event {
  id: number;
  name: string;
}

const ScannerPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchActiveEvents = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('id, name')
        .gte('event_date', today)
        .order('event_date', { ascending: true });

      if (error) {
        toast.error("Gagal memuat event.");
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };
    fetchActiveEvents();
  }, []);

  // Fungsi utama untuk memproses NIP dari hasil scan (kamera atau file)
  const processNip = async (nip: string) => {
    if (nip === lastScanned) return;
    setLastScanned(nip);

    if (!selectedEvent) {
      toast.warning("Silakan pilih event terlebih dahulu.");
      return;
    }

    try {
      toast.info(`Memproses NIP: ${nip}...`);

      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('id, name')
        .eq('nip', nip)
        .single();

      if (employeeError || !employee) {
        throw new Error(`Pegawai dengan NIP ${nip} tidak ditemukan.`);
      }

      const { data: existingAttendee, error: checkError } = await supabase
        .from('attendees')
        .select('id')
        .eq('event_id', selectedEvent.id)
        .eq('employee_id', employee.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      if (existingAttendee) {
        toast.warning(`${employee.name} sudah tercatat hadir.`);
        return;
      }

      const { error: insertError } = await supabase
        .from('attendees')
        .insert({ event_id: selectedEvent.id, employee_id: employee.id });

      if (insertError) throw insertError;

      toast.success(`Berhasil! ${employee.name} tercatat hadir.`);

    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat memproses QR code.");
    } finally {
        setTimeout(() => setLastScanned(null), 3000);
    }
  };

  // Handler untuk upload file
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!("BarcodeDetector" in window)) {
        toast.error("Browser Anda tidak mendukung deteksi QR code dari gambar.");
        return;
    }
    
    // @ts-ignore - BarcodeDetector is not in all TS libs yet
    const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
    try {
        const barcodes = await barcodeDetector.detect(file);
        if (barcodes.length > 0) {
            processNip(barcodes[0].rawValue);
        } else {
            toast.error("Tidak ada QR code yang terdeteksi di gambar.");
        }
    } catch (error) {
        toast.error("Gagal membaca QR code dari gambar.");
    }
  };

  const handleEventChange = (eventId: string) => {
    const event = events.find(e => e.id.toString() === eventId);
    setSelectedEvent(event || null);
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">QR Scanner Presensi</CardTitle>
            <CardDescription>
              Pilih event, lalu arahkan kamera atau upload gambar QR code pegawai.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">1. Pilih Event Aktif</label>
              <Select onValueChange={handleEventChange} disabled={loading || events.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Memuat..." : "Pilih event..."} />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">2. Pindai QR Code</label>
              <div className="mt-2 aspect-square w-full overflow-hidden rounded-lg border bg-gray-200">
                <Scanner
                  onDecode={processNip}
                  onError={(error) => console.log(error?.message)}
                  containerStyle={{ width: '100%', height: '100%', paddingTop: '0' }}
                  videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Atau Upload Gambar QR
            </Button>

            {selectedEvent && (
                <p className="text-center text-sm text-muted-foreground">
                    Scanning untuk event: <span className="font-semibold">{selectedEvent.name}</span>
                </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ScannerPage;
