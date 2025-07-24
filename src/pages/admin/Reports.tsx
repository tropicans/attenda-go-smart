import { useEffect, useState } from "react";
import { columns, AttendanceRecord } from "@/components/admin/ReportColumns";
import { EventDataTable } from "@/components/admin/EventDataTable"; // Kita akan gunakan kembali komponen ini
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/components/admin/EventColumns"; // Tipe untuk event
import { CSVLink } from "react-csv";

const ReportsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [csvData, setCsvData] = useState<any[]>([]);

    // Mengambil daftar semua event untuk dropdown
    useEffect(() => {
        async function getEvents() {
            const { data } = await supabase
                .from('events')
                .select('id, name')
                .order('event_date', { ascending: false });
            setEvents(data || []);
        }
        getEvents();
    }, []);

    // Mengambil data kehadiran saat event dipilih
    useEffect(() => {
        async function getAttendance() {
            if (!selectedEventId) {
                setAttendanceData([]);
                return;
            };

            setLoading(true);
            const { data, error } = await supabase
                .from('attendees')
                .select(`
                    check_in_time,
                    employees (
                        nip,
                        name,
                        unit_kerja
                    )
                `)
                .eq('event_id', selectedEventId);
            
            if (error) {
                console.error("Error fetching attendance:", error);
                setAttendanceData([]);
            } else {
                setAttendanceData(data as AttendanceRecord[] || []);
                
                // Siapkan data untuk export CSV
                const formattedForCsv = data.map(record => ({
                    NIP: record.employees.nip,
                    Nama: record.employees.name,
                    UnitKerja: record.employees.unit_kerja,
                    WaktuCheckIn: new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeStyle: 'long' }).format(new Date(record.check_in_time)),
                }));
                setCsvData(formattedForCsv);
            }
            setLoading(false);
        }
        getAttendance();
    }, [selectedEventId]);

    const selectedEvent = events.find(e => e.id.toString() === selectedEventId);

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Laporan Kehadiran</h1>
                    <p className="text-muted-foreground">
                        Pilih event untuk melihat daftar kehadiran peserta.
                    </p>
                </div>
                {selectedEvent && attendanceData.length > 0 && (
                    <CSVLink 
                        data={csvData}
                        filename={`laporan-kehadiran-${selectedEvent.name.replace(/\s+/g, '-')}.csv`}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export ke CSV
                    </CSVLink>
                )}
            </div>

            <div className="flex items-center space-x-4 mb-4">
                <label className="font-medium">Pilih Event:</label>
                <Select onValueChange={setSelectedEventId}>
                    <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Pilih salah satu event" />
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

            {loading ? (
                <p>Memuat data kehadiran...</p>
            ) : selectedEventId ? (
                <EventDataTable columns={columns} data={attendanceData} />
            ) : (
                <div className="text-center py-10 border rounded-md">
                    <p className="text-muted-foreground">Silakan pilih event untuk menampilkan laporan.</p>
                </div>
            )}
        </div>
    )
}

export default ReportsPage;
