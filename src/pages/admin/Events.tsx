import { useEffect, useState, useMemo } from "react";
import { columns, Event } from "@/components/admin/EventColumns";
import { EventDataTable } from "@/components/admin/EventDataTable";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EventFormDialog } from "@/components/admin/EventFormDialog";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog"; // 1. Import dialog konfirmasi

const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    
    // 2. State untuk mengelola dialog
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // 3. State untuk menyimpan data event yang akan di-aksi
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

    async function getEvents() {
        setLoading(true);
        const { data, error } = await supabase
            .from('events')
            .select('id, name, event_date')
            .order('event_date', { ascending: false });
        
        if (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
        } else {
            setEvents(data || []);
        }
        setLoading(false);
    }

    useEffect(() => {
        getEvents();
    }, []);

    // 4. Handler untuk membuka dialog
    const handleAddNew = () => {
        setEventToEdit(null); // Pastikan mode tambah, bukan edit
        setIsFormOpen(true);
    };

    const handleEdit = (event: Event) => {
        setEventToEdit(event);
        setIsFormOpen(true);
    };

    const handleDelete = (event: Event) => {
        setEventToDelete(event);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!eventToDelete) return;

        setIsDeleting(true);
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventToDelete.id);
        
        setIsDeleting(false);

        if (error) {
            console.error("Error deleting event:", error);
            // Di aplikasi nyata, Anda akan menampilkan notifikasi error
        } else {
            setIsDeleteOpen(false);
            setEventToDelete(null);
            getEvents(); // Refresh tabel
        }
    };

    const handleSuccess = () => {
        getEvents(); // Refresh tabel setelah tambah/edit
    };

    // 5. Definisikan meta untuk diteruskan ke tabel
    const tableMeta = useMemo(() => ({
        onEdit: handleEdit,
        onDelete: handleDelete,
    }), []);

    return (
        <>
            <div className="container mx-auto py-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Event</h1>
                        <p className="text-muted-foreground">
                            Tambah, edit, atau hapus event presensi di sini.
                        </p>
                    </div>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Event Baru
                    </Button>
                </div>
                {loading ? (
                    <p>Memuat data...</p>
                ) : (
                    <EventDataTable columns={columns} data={events} meta={tableMeta} /> // 6. Teruskan meta ke tabel
                )}
            </div>

            {/* 7. Render semua dialog */}
            <EventFormDialog 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                initialData={eventToEdit}
            />
            <DeleteConfirmationDialog 
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                itemName={eventToDelete?.name || ""}
            />
        </>
    )
}

export default EventsPage;
