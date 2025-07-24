import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import QRCode from "react-qr-code";
import { Loader2, Download } from 'lucide-react';

// Tipe untuk data event
interface Event {
  id: number;
  name: string;
  event_date: string;
}

// Tipe untuk props komponen
interface GenerateQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateQrModal = ({ isOpen, onClose }: GenerateQrModalProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Mengambil data event aktif saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      const fetchActiveEvents = async () => {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('events')
          .select('id, name, event_date')
          .gte('event_date', today)
          .order('event_date', { ascending: true });

        if (error) {
          console.error('Error fetching events:', error);
        } else if (data) {
          setEvents(data);
        }
        setLoading(false);
      };

      fetchActiveEvents();
    } else {
      // Reset state saat modal ditutup
      setSelectedEvent(null);
      setEvents([]);
    }
  }, [isOpen]);

  // Fungsi untuk menangani download QR code
  const handleDownload = () => {
    if (qrCodeRef.current && selectedEvent) {
        const svg = qrCodeRef.current.querySelector('svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const svgSize = svg.getBoundingClientRect();
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.download = `qrcode-${selectedEvent.name.replace(/\s+/g, '-').toLowerCase()}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            };
            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        }
    }
  };
  
  const handleEventChange = (eventId: string) => {
      const event = events.find(e => e.id.toString() === eventId);
      setSelectedEvent(event || null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate QR Code Presensi</DialogTitle>
          <DialogDescription>
            Pilih event untuk membuat QR code. Peserta akan memindai kode ini untuk check-in.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="event-select" className="text-sm font-medium">Pilih Event</label>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memuat event...</span>
              </div>
            ) : (
              <Select onValueChange={handleEventChange} disabled={events.length === 0}>
                <SelectTrigger id="event-select">
                  <SelectValue placeholder={events.length > 0 ? "Pilih salah satu event" : "Tidak ada event aktif"} />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.name} ({new Date(event.event_date).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedEvent && (
            <div className="flex flex-col items-center justify-center pt-4 space-y-4 border-t">
               <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }} ref={qrCodeRef}>
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`${window.location.origin}/attend/${selectedEvent.id}`}
                    viewBox={`0 0 256 256`}
                />
               </div>
              <div className="text-center">
                <p className="font-semibold">{selectedEvent.name}</p>
                <p className="text-sm text-muted-foreground">{new Date(selectedEvent.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={handleDownload} disabled={!selectedEvent}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateQrModal;
