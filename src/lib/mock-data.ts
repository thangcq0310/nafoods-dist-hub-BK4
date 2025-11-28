import type { Customer, Product, Vendor, Order, Delivery, OrderStatus, DeliveryStatus, Address } from './types';
import { subDays, formatISO } from 'date-fns';

const createAddress = (id: string, street: string, city: string, phone: string, isPrimary = false): Address => ({ id, street, city, phone, isPrimary });

export const customers: Customer[] = [
  { id: 'C001', name: 'Siêu thị CoopMart', area: 'TP.HCM', salesChannel: 'Modern Trade', status: 'Active', addresses: [
    createAddress('A001', '123 Cống Quỳnh, Q.1', 'TP.HCM', '0901234567', true),
    createAddress('A002', '456 Nguyễn Đình Chiểu, Q.3', 'TP.HCM', '0901234568'),
  ]},
  { id: 'C002', name: 'Tạp hóa bà Tám', area: 'Bình Dương', salesChannel: 'General Trade', status: 'Active', addresses: [
    createAddress('A003', '789 Đường 30/4, Thủ Dầu Một', 'Bình Dương', '0912345678', true),
  ]},
  { id: 'C003', name: 'Nhà hàng The Deck', area: 'TP.HCM', salesChannel: 'HORECA', status: 'Active', addresses: [
    createAddress('A004', '17 Nguyễn Ư Dĩ, Thảo Điền, Q.2', 'TP.HCM', '0987654321', true),
  ]},
  { id: 'C004', name: 'Chuỗi Bách Hóa Xanh', area: 'Toàn quốc', salesChannel: 'Modern Trade', status: 'Active', addresses: [
    createAddress('A005', '1/1 Tô Ký, Hóc Môn', 'TP.HCM', '0934567890', true),
    createAddress('A006', '55 Lê Lợi, Gò Vấp', 'TP.HCM', '0934567891'),
  ]},
  { id: 'C005', name: 'Khách sạn Park Hyatt', area: 'TP.HCM', salesChannel: 'HORECA', status: 'Inactive', addresses: [
     createAddress('A007', '2 Công trường Lam Sơn, Q.1', 'TP.HCM', '0923456789', true),
  ]},
];

export const products: Product[] = [
  { id: 'P001', name: 'Chanh dây sấy dẻo', category: 'Trái cây sấy', status: 'Active' },
  { id: 'P002', name: 'Nước ép Chanh Dây', category: 'Nước ép', status: 'Active' },
  { id: 'P003', name: 'Mít sấy', category: 'Trái cây sấy', status: 'Active' },
  { id: 'P004', name: 'Snack khoai lang', category: 'Snacks', status: 'Inactive' },
  { id: 'P005', name: 'Mứt dâu tằm', category: 'Mứt', status: 'Active' },
];

export const vendors: Vendor[] = [
  { id: 'V001', name: 'Giao Hàng Nhanh', contactPerson: 'Anh Phúc', phone: '19001234', status: 'Active' },
  { id: 'V002', name: 'Viettel Post', contactPerson: 'Chị Lan', phone: '19005678', status: 'Active' },
  { id: 'V003', name: 'Xe tải công ty', contactPerson: 'Nội bộ', phone: 'N/A', status: 'Active' },
];

const generateOrders = (): Order[] => {
  const statuses: OrderStatus[] = ['Pending Approval', 'Confirmed', 'Canceled'];
  let orders: Order[] = [];
  for (let i = 1; i <= 25; i++) {
    const customer = customers[i % customers.length];
    orders.push({
      id: `DH-${String(i).padStart(5, '0')}`,
      customer: customer,
      shippingAddress: customer.addresses[0],
      orderDate: formatISO(subDays(new Date(), Math.floor(i/2))),
      deliveryDate: formatISO(subDays(new Date(), Math.floor(i/2) - 2)),
      items: [
        { product: products[i % products.length], quantity: i * 2, unit: 'Thùng' },
        ...(i % 2 === 0 ? [{ product: products[(i + 1) % products.length], quantity: i + 5, unit: 'Kg' as 'Kg' }] : [])
      ],
      status: i > 20 ? 'Pending Approval' : (i < 5 ? 'Canceled' : 'Confirmed'),
    });
  }
  return orders;
};

export const orders: Order[] = generateOrders();

const generateDeliveries = (orders: Order[]): Delivery[] => {
  let deliveries: Delivery[] = [];
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed');
  
  const deliveryStatuses: DeliveryStatus[] = ['Cần giao', 'Chờ giao', 'Đang giao', 'Đã giao', 'Thất bại', 'Đã hủy'];

  for (let i = 0; i < confirmedOrders.length; i++) {
    const order = confirmedOrders[i];
    let status: DeliveryStatus = 'Cần giao';
    let deliveryDetails: Partial<Delivery> = {};

    if (i < confirmedOrders.length * 0.8) { // 80% have been processed beyond 'Needs Delivery'
      const statusIndex = Math.floor(Math.random() * (deliveryStatuses.length - 1)) + 1; // Pick any status other than 'Needs Delivery'
      status = deliveryStatuses[statusIndex];
      const vendor = vendors[i % vendors.length];
      
      deliveryDetails = {
        vendor: vendor,
        deliveryDateTime: formatISO(new Date(order.deliveryDate)),
        driverName: `Tài xế ${i+1}`,
        driverPhone: `090${i.toString().padStart(7, '0')}`,
        vehicleNumber: `51C-${i.toString().padStart(5,'0')}`,
      };
    }
    
    // Some are completed today
    if (i > confirmedOrders.length * 0.6 && status === 'Đã giao') {
      deliveryDetails.deliveryDateTime = formatISO(new Date());
    }

    deliveries.push({
      id: `GH-${String(i + 1).padStart(5, '0')}`,
      order: order,
      status: status,
      ...deliveryDetails
    });
  }
  return deliveries;
};

export const deliveries: Delivery[] = generateDeliveries(orders);

// Update order statuses based on deliveries that were canceled/failed
deliveries.forEach(d => {
  if (d.status === 'Đã hủy') {
    const order = orders.find(o => o.id === d.order.id);
    if(order) order.status = 'Canceled';
  }
});
