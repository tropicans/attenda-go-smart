"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

// Definisikan tipe data untuk sebuah baris laporan
// Ini adalah hasil gabungan dari tabel attendees dan employees
export type AttendanceRecord = {
  check_in_time: string
  employees: {
    nip: string
    name: string
    unit_kerja: string | null
  }
}

export const columns: ColumnDef<AttendanceRecord>[] = [
  {
    // Akses data NIP dari objek employees yang bersarang
    accessorKey: "employees.nip",
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
    // Sediakan nilai sel kustom untuk memastikan NIP ditampilkan
    cell: ({ row }) => row.original.employees.nip,
  },
  {
    accessorKey: "employees.name",
    header: "Nama Pegawai",
    cell: ({ row }) => row.original.employees.name,
  },
  {
    accessorKey: "employees.unit_kerja",
    header: "Unit Kerja",
    cell: ({ row }) => row.original.employees.unit_kerja || "-",
  },
  {
    accessorKey: "check_in_time",
    header: "Waktu Check-in",
    cell: ({ row }) => {
        const date = new Date(row.original.check_in_time)
        // Format tanggal dan waktu agar lebih mudah dibaca
        return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'long',
        }).format(date)
    }
  },
]
