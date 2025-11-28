import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Khách hàng</h1>
        <Card>
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Chức năng quản lý khách hàng, bao gồm thêm/sửa/xóa và quản lý nhiều địa chỉ giao hàng, đang được phát triển.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
