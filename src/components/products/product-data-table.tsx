
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useData } from "@/hooks/use-data";
import { productColumns } from "./product-columns";
import type { Product } from "@/lib/types";
import { Card } from "../ui/card";

export function ProductDataTable() {
  const { products } = useData();
  const [data, setData] = React.useState<Product[]>(products);

  React.useEffect(() => {
    setData(products);
  }, [products]);

  const table = useReactTable({
    data,
    columns: productColumns as ColumnDef<Product, unknown>[],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="p-4 bg-card">
      <div className="rounded-md border">
        <Table>
           <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-card-foreground">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="[&_td]:text-card-foreground"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={productColumns.length}
                  className="h-24 text-center text-card-foreground"
                >
                  Không tìm thấy kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
