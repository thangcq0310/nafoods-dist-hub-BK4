
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
  { id: 'P001', name: 'Chanh dây sấy dẻo', category: 'Trái cây sấy', price: 120000, status: 'Active' },
  { id: 'P002', name: 'Nước ép Chanh Dây', category: 'Nước ép', price: 250000, status: 'Active' },
  { id: 'P003', name: 'Mít sấy', category: 'Trái cây sấy', price: 150000, status: 'Active' },
  { id: 'P004', name: 'Snack khoai lang', category: 'Snacks', price: 80000, status: 'Inactive' },
  { id: 'P005', name: 'Mứt dâu tằm', category: 'Mứt', price: 180000, status: 'Active' },
];

export const vendors: Vendor[] = [
  { id: 'V001', name: 'Giao Hàng Nhanh', contactPerson: 'Anh Phúc', phone: '19001234', status: 'Active' },
  { id: 'V002', name: 'Viettel Post', contactPerson: 'Chị Lan', phone: '19005678', status: 'Active' },
  { id: 'V003', name: 'Xe tải công ty', contactPerson: 'Nội bộ', phone: 'N/A', status: 'Active' },
];

const generateOrders = (): Order[] => {
  const statuses: OrderStatus[] = ['Pending', 'Confirmed', 'Canceled'];
  let orders: Order[] = [];
  const baseDate = new Date(2024, 6, 20, 10, 30, 0); // A static date to avoid hydration errors

  for (let i = 1; i <= 25; i++) {
    const customer = customers[i % customers.length];
    const status = i > 20 ? 'Pending' : (i < 5 ? 'Canceled' : 'Confirmed');
    const orderDate = subDays(baseDate, Math.floor(i/2));
    const deliveryDate = subDays(baseDate, Math.floor(i/2) - 2);
    
    let confirmationDate: string | undefined;
    if (status === 'Confirmed') {
        const confDate = new Date(orderDate.getTime());
        confDate.setDate(confDate.getDate() + 1);
        confDate.setHours(14, 6, 0); // Static time for confirmation
        confirmationDate = formatISO(confDate);
    }
    
    const items = [
      { product: products[i % products.length], quantity: i * 2, unit: 'Box' as const, unitPrice: products[i % products.length].price, total: products[i % products.length].price * i * 2 },
      ...(i % 2 === 0 ? [{ product: products[(i + 1) % products.length], quantity: i + 5, unit: 'Kg' as const, unitPrice: products[(i + 1) % products.length].price, total: products[(i + 1) % products.length].price * (i+5) }] : [])
    ];
    
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);


    orders.push({
      id: `DH-${String(i).padStart(5, '0')}`,
      customer: customer,
      shippingAddress: customer.addresses[0],
      orderDate: formatISO(orderDate),
      deliveryDate: formatISO(deliveryDate),
      confirmationDate: confirmationDate,
      items: items,
      totalAmount,
      status: status,
    });
  }
  return orders;
};

export const orders: Order[] = generateOrders();

const generateDeliveries = (orders: Order[]): Delivery[] => {
  let deliveries: Delivery[] = [];
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed' || o.status === 'Canceled');
  
  const deliveryStatuses: DeliveryStatus[] = ['Cần giao', 'Chờ giao', 'Đang giao', 'Đã giao', 'Thất bại', 'Đã hủy'];

  for (let i = 0; i < confirmedOrders.length; i++) {
    const order = confirmedOrders[i];
    let status: DeliveryStatus = 'Cần giao';
    let deliveryDetails: Partial<Delivery> = {};

    // If order is canceled, its delivery is canceled
    if (order.status === 'Canceled') {
        status = 'Đã hủy';
    } else if (i < confirmedOrders.length * 0.8) { // 80% have been processed beyond 'Needs Delivery'
      const statusIndex = Math.floor(Math.random() * (deliveryStatuses.length - 2)) + 1; // Pick any status other than 'Needs Delivery' or 'Canceled'
      status = deliveryStatuses[statusIndex];
      const vendor = vendors[i % vendors.length];
      
      deliveryDetails = {
        vendor: vendor,
        deliveryDateTime: order.deliveryDate, // Use the static delivery date
        driverName: `Tài xế ${i+1}`,
        driverPhone: `090${i.toString().padStart(7, '0')}`,
        vehicleNumber: `51C-${i.toString().padStart(5,'0')}`,
        deliveryFee: (i+1) * 10000,
      };
    }
    
    // Some are completed today
    if (i > confirmedOrders.length * 0.6 && status === 'Đã giao') {
      const completionDate = new Date();
      completionDate.setHours(11, 20, 0);
      deliveryDetails.deliveryDateTime = formatISO(completionDate);
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

// Ensure all confirmed orders have a delivery record.
orders.forEach(order => {
  if (order.status === 'Confirmed' && !deliveries.some(d => d.order.id === order.id)) {
    deliveries.push({
      id: `GH-${String(deliveries.length + 1).padStart(5, '0')}`,
      order,
      status: 'Cần giao',
    });
  }
});
