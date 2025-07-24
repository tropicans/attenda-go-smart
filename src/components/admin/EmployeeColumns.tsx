"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Definisikan tipe data untuk seorang Pegawai, sesuai tabel Supabase
export type Employee = {
  id: number
  nip: string
  name: string
  unit_kerja: string | null
  whatsapp_number: string | null
}

// Definisikan tipe untuk meta, yang akan berisi fungsi-fungsi kita
interface EmployeeTableMeta {
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "nip",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NIP
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Nama Pegawai",
  },
  {
    accessorKey: "unit_kerja",
    header: "Unit Kerja",
  },
  {
    accessorKey: "whatsapp_number",
    header: "No. WhatsApp",
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const employee = row.original
      const meta = table.options.meta as EmployeeTableMeta

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(employee.nip)}
            >
              Salin NIP
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta.onEdit(employee)}>
              Edit Pegawai
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => meta.onDelete(employee)}
              className="text-red-600 focus:text-red-500 focus:bg-red-50"
            >
              Hapus Pegawai
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
