
import { CustomerDataTable } from "@/components/customers/customer-data-table";

export default function CustomersPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Quản lý Khách hàng</h1>
        </div>
        <CustomerDataTable />
      </div>
    </div>
  );
}
