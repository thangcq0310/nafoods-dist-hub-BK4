
"use client";

import type { Product } from "@/lib/types";
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


export const productColumns = [
  {
    accessorKey: "id",
    header: "Mã Sản phẩm",
    cell: ({ row }: { row: { original: Product } }) => <div className="font-medium">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: "Tên Sản phẩm",
    cell: ({ row }: { row: { original: Product } }) => row.original.name,
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ row }: { row: { original: Product } }) => row.original.category,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Giá</div>,
    cell: ({ row }: { row: { original: Product } }) => {
        const price = row.original.price;
        return <div className="text-right font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }: { row: { original: Product } }) => {
      const status = row.original.status;
      return <Badge variant={status === 'Active' ? 'default' : 'secondary'}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }: { row: { original: Product } }) => {
      const product = row.original;
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
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
