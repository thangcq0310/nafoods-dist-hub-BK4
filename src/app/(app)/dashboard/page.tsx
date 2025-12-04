import { KpiCards } from "@/components/dashboard/kpi-cards";
import { OrdersToProcessTable } from "@/components/dashboard/orders-to-process-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển Kho vận</h1>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="analytics" disabled>Phân tích</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
             <KpiCards />
             <div className="grid grid-cols-1 gap-4">
                <OrdersToProcessTable />
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
