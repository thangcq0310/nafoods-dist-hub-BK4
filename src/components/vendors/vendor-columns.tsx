
"use client";

import type { Vendor } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export const vendorColumns = [
  {
    accessorKey: "id",
    header: "Mã Nhà vận tải",
    cell: ({ row }: { row: { original: Vendor } }) => <div className="font-medium">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: "Tên Nhà vận tải",
    cell: ({ row }: { row: { original: Vendor } }) => row.original.name,
  },
  {
    accessorKey: "contactPerson",
    header: "Người liên hệ",
    cell: ({ row }: { row: { original: Vendor } }) => row.original.contactPerson,
  },
    {
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }: { row: { original: Vendor } }) => row.original.phone,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }: { row: { original: Vendor } }) => {
      const status = row.original.status;
      return <Badge variant={status === 'Active' ? 'default' : 'secondary'}>{status}</Badge>;
    },
  },
];
