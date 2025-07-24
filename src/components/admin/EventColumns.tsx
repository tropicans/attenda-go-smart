"use client"

import { ColumnDef, Row, Table } from "@tanstack/react-table"
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

// Definisikan tipe data untuk sebuah Event
export type Event = {
  id: number
  name: string
  event_date: string
}

// 1. Definisikan tipe untuk meta, yang akan berisi fungsi-fungsi kita
interface EventTableMeta {
  onEdit: (event: Event) => void
  onDelete: (event: Event) => void
}

// 2. Ubah 'cell' untuk mengakses fungsi dari meta
export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Event
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "event_date",
    header: "Tanggal",
    cell: ({ row }) => {
        const date = new Date(row.original.event_date)
        return new Intl.DateTimeFormat('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date)
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const event = row.original
      const meta = table.options.meta as EventTableMeta // 3. Ambil meta dari tabel

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
              onClick={() => navigator.clipboard.writeText(event.id.toString())}
            >
              Salin ID Event
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* 4. Panggil fungsi onEdit dan onDelete dari meta */}
            <DropdownMenuItem onClick={() => meta.onEdit(event)}>
              Edit Event
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => meta.onDelete(event)}
              className="text-red-600 focus:text-red-500 focus:bg-red-50"
            >
              Hapus Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
