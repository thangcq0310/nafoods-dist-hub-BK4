import { OrderStatusChart } from "@/components/dashboard/order-status-chart";
import { DeliveryStatusChart } from "@/components/dashboard/delivery-status-chart";
import { OrderKpiCards } from "@/components/dashboard/order-kpi-cards";
import { AtRiskOrdersTable } from "@/components/dashboard/at-risk-orders-table";
import { VendorDistributionChart } from "@/components/dashboard/vendor-distribution-chart";
import { OnTimeDeliveryChart } from "@/components/dashboard/on-time-delivery-chart";
import { Separator } from "@/components/ui/separator";
import { DeliveryKpiCards } from "@/components/dashboard/delivery-kpi-cards";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển Kho vận</h1>
        
        {/* Section 1: Orders Summary */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">1. Tóm tắt Đơn hàng</h2>
            <OrderKpiCards />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-12 lg:col-span-4">
                    <OrderStatusChart />
                </div>
                <div className="col-span-12 lg:col-span-3">
                    <AtRiskOrdersTable />
                </div>
            </div>
        </div>

        <Separator />
        
        {/* Section 2: Deliveries Status */}
         <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">2. Giám sát Giao hàng</h2>
            <DeliveryKpiCards />
            <div className="grid gap-4 md:grid-cols-1">
                <DeliveryStatusChart />
            </div>
        </div>
        
        <Separator />

        {/* Section 3: Vendor Performance */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">3. Hiệu suất Nhà Vận Tải</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <VendorDistributionChart />
            <OnTimeDeliveryChart />
          </div>
        </div>
      </div>
    </div>
  );
}
