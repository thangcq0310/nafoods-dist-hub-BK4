import { OrderStatusChart } from "@/components/dashboard/order-status-chart";
import { DeliveryStatusChart } from "@/components/dashboard/delivery-status-chart";
import { OrderKpiCards } from "@/components/dashboard/order-kpi-cards";
import { AtRiskOrdersTable } from "@/components/dashboard/at-risk-orders-table";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển Kho vận</h1>
        
        <div className="space-y-4">
          <OrderKpiCards />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-12 lg:col-span-4">
                <OrderStatusChart />
              </div>
              <div className="col-span-12 lg:col-span-3">
                 <DeliveryStatusChart />
              </div>
          </div>
          <div>
            <AtRiskOrdersTable />
          </div>
        </div>
      </div>
    </div>
  );
}
