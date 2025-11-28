import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VendorsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Nhà vận tải</h1>
        <Card>
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Chức năng quản lý danh sách các đối tác vận chuyển đang được phát triển.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
