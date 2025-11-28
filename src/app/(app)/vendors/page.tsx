
import { VendorDataTable } from "@/components/vendors/vendor-data-table";

export default function VendorsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Quản lý Nhà vận tải</h1>
        </div>
        <VendorDataTable />
      </div>
    </div>
  );
}
