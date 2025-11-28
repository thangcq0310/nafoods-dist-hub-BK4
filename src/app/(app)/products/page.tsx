
import { ProductDataTable } from "@/components/products/product-data-table";
import { CreateProductSheet } from "@/components/products/create-product-sheet";

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Quản lý Sản phẩm</h1>
            <CreateProductSheet />
        </div>
        <ProductDataTable />
      </div>
    </div>
  );
}
