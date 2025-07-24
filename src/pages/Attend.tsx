import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Tipe untuk data event
interface Event {
  id: number;
  name: string;
  event_date: string;
}

// Tipe untuk status halaman
type PageStatus = 'loading' | 'form' | 'submitting' | 'success' | 'error' | 'not_found' | 'already_attended';

const AttendPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [nip, setNip] = useState('');
  const [status, setStatus] = useState<PageStatus>('loading');
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setStatus('not_found');
        return;
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error || !data) {
        console.error('Error fetching event:', error);
        setStatus('not_found');
      } else {
        setEvent(data);
        setStatus('form');
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nip.trim() || !eventId) return;

    setStatus('submitting');

    try {
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('id, name')
        .eq('nip', nip.trim())
        .single();

      if (employeeError || !employee) {
        throw new Error('NIP tidak ditemukan. Pastikan NIP Anda benar.');
      }

      const { data: existingAttendee, error: checkError } = await supabase
        .from('attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('employee_id', employee.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      if (existingAttendee) {
        setEmployeeName(employee.name);
        setStatus('already_attended');
        return;
      }

      const { error: insertError } = await supabase
        .from('attendees')
        .insert({
          event_id: parseInt(eventId, 10),
          employee_id: employee.id,
        });

      if (insertError) throw insertError;

      setEmployeeName(employee.name);
      setStatus('success');

    } catch (error: any) {
        toast.error(error.message);
        setStatus('error');
    }
  };
  
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <CardContent>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        );
      case 'form':
      case 'submitting':
      case 'error':
        return (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nip" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Induk Pegawai (NIP)
                </label>
                <Input
                  id="nip"
                  type="text"
                  placeholder="Masukkan NIP Anda"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  disabled={status === 'submitting'}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={status === 'submitting'}>
                {status === 'submitting' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Konfirmasi Kehadiran
              </Button>
            </form>
          </CardContent>
        );
      case 'success':
        return (
          <CardContent className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <p className="text-lg">Terima kasih, {employeeName}! Kehadiran Anda berhasil dicatat.</p>
          </CardContent>
        );
      case 'already_attended':
        return (
            <CardContent className="text-center">
              <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
              <p className="text-lg">Anda sudah tercatat hadir, {employeeName}.</p>
            </CardContent>
          );
      case 'not_found':
        return (
          <CardContent className="text-center">
            <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <p className="text-lg">Event tidak ditemukan.</p>
            <p className="text-sm text-muted-foreground">Pastikan QR code yang Anda pindai valid.</p>
          </CardContent>
        );
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img src="/src/assets/logo.png" alt="Attenda Logo" className="w-24 mx-auto mb-4" />
            {event ? (
              <>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>{new Date(event.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
              </>
            ) : (
              <Skeleton className="h-8 w-3/4 mx-auto" />
            )}
          </CardHeader>
          {renderContent()}
        </Card>
      </div>
    </>
  );
};

export default AttendPage;
