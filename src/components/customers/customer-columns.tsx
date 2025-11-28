
"use client";

import type { Customer } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";

export const customerColumns = [
  {
    accessorKey: "id",
    header: "Mã Khách hàng",
    cell: ({ row }: { row: { original: Customer } }) => <div className="font-medium">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: "Tên Khách hàng",
    cell: ({ row }: { row: { original: Customer } }) => row.original.name,
  },
  {
    accessorKey: "area",
    header: "Khu vực",
    cell: ({ row }: { row: { original: Customer } }) => row.original.area,
  },
    {
    accessorKey: "salesChannel",
    header: "Kênh bán hàng",
    cell: ({ row }: { row: { original: Customer } }) => row.original.salesChannel,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }: { row: { original: Customer } }) => {
      const status = row.original.status;
      return <Badge variant={status === 'Active' ? 'default' : 'secondary'}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }: { row: { original: Customer } }) => {
      const customer = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    header: () => <div className="text-right">Hành động</div>,
  },
];
