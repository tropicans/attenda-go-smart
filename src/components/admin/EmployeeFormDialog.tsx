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
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Employee } from "./EmployeeColumns"; // Import tipe Employee

interface EmployeeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Employee | null;
}

export function EmployeeFormDialog({ isOpen, onClose, onSuccess, initialData }: EmployeeFormDialogProps) {
  const [formData, setFormData] = useState({
    nip: "",
    name: "",
    unit_kerja: "",
    whatsapp_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditMode = !!initialData;

  useEffect(() => {
    if (isEditMode && isOpen) {
      setFormData({
        nip: initialData.nip,
        name: initialData.name,
        unit_kerja: initialData.unit_kerja || "",
        whatsapp_number: initialData.whatsapp_number || "",
      });
    } else {
      setFormData({
        nip: "",
        name: "",
        unit_kerja: "",
        whatsapp_number: "",
      });
      setErrorMessage("");
    }
  }, [isOpen, initialData, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nip.trim() || !formData.name.trim()) {
      setErrorMessage("NIP dan Nama Pegawai tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const dataToSubmit = {
        ...formData,
        unit_kerja: formData.unit_kerja || null,
        whatsapp_number: formData.whatsapp_number || null,
    };

    let error = null;

    if (isEditMode) {
      const { error: updateError } = await supabase
        .from("employees")
        .update(dataToSubmit)
        .eq("id", initialData.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("employees")
        .insert([dataToSubmit]);
      error = insertError;
    }

    setIsLoading(false);

    if (error) {
      setErrorMessage(`Gagal ${isEditMode ? 'memperbarui' : 'menyimpan'} data. Pastikan NIP unik.`);
      console.error("Error saving employee:", error);
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Pegawai" : "Tambah Pegawai Baru"}</DialogTitle>
          <DialogDescription>
            Isi detail pegawai di bawah ini. Klik simpan jika sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nip" className="text-right">NIP</Label>
            <Input id="nip" value={formData.nip} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nama</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit_kerja" className="text-right">Unit Kerja</Label>
            <Input id="unit_kerja" value={formData.unit_kerja} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="whatsapp_number" className="text-right">No. WhatsApp</Label>
            <Input id="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} className="col-span-3" />
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
