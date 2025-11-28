import { KpiCards } from "@/components/dashboard/kpi-cards";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="analytics" disabled>Phân tích</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
             <KpiCards />
             <div className="grid grid-cols-1">
                <RecentOrdersTable />
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
