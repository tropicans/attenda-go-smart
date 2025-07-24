import { useEffect, useState, useMemo } from "react";
import { columns, Employee } from "@/components/admin/EmployeeColumns";
import { EmployeeDataTable } from "@/components/admin/EmployeeDataTable";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EmployeeFormDialog } from "@/components/admin/EmployeeFormDialog";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";

const EmployeesPage = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State untuk mengelola dialog
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // State untuk menyimpan data pegawai yang akan di-aksi
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

    async function getEmployees() {
        setLoading(true);
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) {
            console.error("Error fetching employees:", error);
            setEmployees([]);
        } else {
            setEmployees(data || []);
        }
        setLoading(false);
    }

    useEffect(() => {
        getEmployees();
    }, []);

    // Handler untuk membuka dialog
    const handleAddNew = () => {
        setEmployeeToEdit(null);
        setIsFormOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setEmployeeToEdit(employee);
        setIsFormOpen(true);
    };

    const handleDelete = (employee: Employee) => {
        setEmployeeToDelete(employee);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!employeeToDelete) return;

        setIsDeleting(true);
        const { error } = await supabase
            .from('employees')
            .delete()
            .eq('id', employeeToDelete.id);
        
        setIsDeleting(false);

        if (error) {
            console.error("Error deleting employee:", error);
        } else {
            setIsDeleteOpen(false);
            setEmployeeToDelete(null);
            getEmployees(); // Refresh tabel
        }
    };

    const handleSuccess = () => {
        getEmployees(); // Refresh tabel setelah tambah/edit
    };

    // Definisikan meta untuk diteruskan ke tabel
    const tableMeta = useMemo(() => ({
        onEdit: handleEdit,
        onDelete: handleDelete,
    }), []);

    return (
        <>
            <div className="container mx-auto py-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Pegawai</h1>
                        <p className="text-muted-foreground">
                            Tambah, edit, atau hapus data pegawai di sini.
                        </p>
                    </div>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Pegawai Baru
                    </Button>
                </div>
                {loading ? (
                    <p>Memuat data...</p>
                ) : (
                    <EmployeeDataTable columns={columns} data={employees} meta={tableMeta} />
                )}
            </div>

            {/* Render semua dialog */}
            <EmployeeFormDialog 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                initialData={employeeToEdit}
            />
            <DeleteConfirmationDialog 
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                itemName={employeeToDelete?.name || ""}
            />
        </>
    )
}

export default EmployeesPage;
