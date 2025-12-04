
"use client";

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useData } from '@/hooks/use-data';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

export default function PrintDeliveryPage() {
  const params = useParams();
  const { deliveries } = useData();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const delivery = deliveries.find(d => d.id === params.id);

  if (!isClient) {
    return <div className="p-10">Đang tải dữ liệu...</div>
  }
  
  if (!delivery) {
    return <div className="p-10">Không tìm thấy phiếu giao hàng.</div>;
  }
  
  const order = delivery.order;

  return (
    <div className="bg-white text-black p-8 sm:p-12 font-sans max-w-4xl mx-auto">
      <header className="flex justify-between items-start mb-8 print:mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">PHIẾU GIAO HÀNG</h1>
          <p className="text-gray-600">Mã đơn hàng: {order.id}</p>
        </div>
        <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">NAFOODS GROUP</h2>
            <p className="text-sm text-gray-500">KCN Trà Vinh, Việt Nam</p>
        </div>
      </header>

      <Button onClick={() => window.print()} className="mb-8 print:hidden">
        <Printer className="mr-2 h-4 w-4" /> In Phiếu
      </Button>

      <main>
        <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
                <h3 className="font-semibold text-gray-700 border-b pb-2 mb-2">Bên Giao (NAFOODS)</h3>
                <p><strong>Nhà vận tải:</strong> {delivery.vendor?.name || 'N/A'}</p>
                <p><strong>Tài xế:</strong> {delivery.driverName || 'N/A'}</p>
                <p><strong>Điện thoại:</strong> {delivery.driverPhone || 'N/A'}</p>
                <p><strong>Biển số xe:</strong> {delivery.vehicleNumber || 'N/A'}</p>
                <p><strong>Ngày giao:</strong> {delivery.deliveryDateTime ? format(new Date(delivery.deliveryDateTime), 'dd/MM/yyyy HH:mm') : 'N/A'}</p>
            </div>
            <div>
                <h3 className="font-semibold text-gray-700 border-b pb-2 mb-2">Bên Nhận (Khách Hàng)</h3>
                <p><strong>Tên đơn vị:</strong> {order.customer.name}</p>
                <p><strong>Địa chỉ giao:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}</p>
                <p><strong>SĐT người nhận:</strong> {order.shippingAddress.phone}</p>
                <p><strong>Ngày đặt hàng:</strong> {format(new Date(order.orderDate), 'dd/MM/yyyy')}</p>
            </div>
        </div>

        <h3 className="font-semibold text-gray-700 mb-2">Chi Tiết Hàng Hóa</h3>
        <Table className="text-black">
          <TableHeader>
            <TableRow>
              <TableHead className="text-black">STT</TableHead>
              <TableHead className="text-black">Tên Sản Phẩm</TableHead>
              <TableHead className="text-black text-right">Số Lượng</TableHead>
              <TableHead className="text-black">Đơn Vị</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item, index) => (
              <TableRow key={item.product.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

         <div className="flex justify-end mt-4">
          <div className="w-full max-w-xs space-y-2">
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold">Phí giao hàng:</span>
              <span>
                {delivery.deliveryFee
                  ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(delivery.deliveryFee)
                  : 'N/A'}
              </span>
            </div>
            <Separator />
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div>
                <p className="font-semibold">Đại Diện Kho Giao</p>
                <p className="text-sm text-gray-600">(Ký, ghi rõ họ tên)</p>
                <div className="h-24"></div>
            </div>
             <div>
                <p className="font-semibold">Tài xế</p>
                <p className="text-sm text-gray-600">(Ký, ghi rõ họ tên)</p>
                <div className="h-24"></div>
            </div>
            <div>
                <p className="font-semibold">Bên Nhận Hàng</p>
                <p className="text-sm text-gray-600">(Ký, ghi rõ họ tên)</p>
                <div className="h-24"></div>
            </div>
        </div>
      </main>

       <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
