import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Event } from "./EventColumns"; // Import tipe Event

interface EventFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Event | null; // 1. Tambah prop untuk data awal (mode edit)
}

export function EventFormDialog({ isOpen, onClose, onSuccess, initialData }: EventFormDialogProps) {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditMode = !!initialData;

  // 2. useEffect untuk mengisi form saat mode edit
  useEffect(() => {
    if (isEditMode && isOpen) {
      setEventName(initialData.name);
      // Tanggal dari Supabase perlu di-parse dengan benar
      setEventDate(new Date(initialData.event_date));
    } else {
      // Reset form saat dialog ditutup atau mode tambah
      setEventName("");
      setEventDate(undefined);
      setErrorMessage("");
    }
  }, [isOpen, initialData, isEditMode]);


  const handleSubmit = async () => {
    if (!eventName.trim() || !eventDate) {
      setErrorMessage("Nama event dan tanggal tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const formattedDate = format(eventDate, "yyyy-MM-dd");
    let error = null;

    // 3. Logika berbeda untuk Edit dan Tambah
    if (isEditMode) {
      const { error: updateError } = await supabase
        .from("events")
        .update({ name: eventName, event_date: formattedDate })
        .eq("id", initialData.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("events")
        .insert([{ name: eventName, event_date: formattedDate }]);
      error = insertError;
    }

    setIsLoading(false);

    if (error) {
      setErrorMessage(`Gagal ${isEditMode ? 'memperbarui' : 'menyimpan'} event. Coba lagi.`);
      console.error("Error saving event:", error);
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {/* 4. Judul dinamis */}
          <DialogTitle>{isEditMode ? "Edit Event" : "Tambah Event Baru"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Ubah detail event di bawah ini." : "Isi detail event di bawah ini."} Klik simpan jika sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nama Event
            </Label>
            <Input
              id="name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="col-span-3"
              placeholder="Contoh: Rapat Koordinasi"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Tanggal
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !eventDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? format(eventDate, "PPP") : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {errorMessage && (
            <p className="col-span-4 text-center text-sm text-red-600">{errorMessage}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
