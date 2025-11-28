import { OrderDataTable } from "@/components/orders/order-data-table";

export default function OrdersPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Quản lý Đơn hàng</h1>
        </div>
        <OrderDataTable />
      </div>
    </div>
  );
}
