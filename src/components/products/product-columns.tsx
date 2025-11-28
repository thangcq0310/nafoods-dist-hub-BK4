
"use client";

import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

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
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }: { row: { original: Product } }) => {
      const status = row.original.status;
      return <Badge variant={status === 'Active' ? 'default' : 'secondary'}>{status}</Badge>;
    },
  },
];
