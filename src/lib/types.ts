export type Customer = {
  id: string;
  name: string;
  area: string;
  salesChannel: string;
  status: 'Active' | 'Inactive';
  addresses: Address[];
};

export type Address = {
  id: string;
  street: string;
  city: string;
  phone: string;
  isPrimary: boolean;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Inactive';
};

export type Vendor = {
  id:string;
  name: string;
  contactPerson: string;
  phone: string;
  status: 'Active' | 'Inactive';
};

export type OrderStatus = 'Pending Approval' | 'Confirmed' | 'Canceled';

export type OrderItem = {
  product: Product;
  quantity: number;
  unit: 'Kg' | 'Jar' | 'Bag' | 'Box'; // Hũ -> Jar, Túi -> Bag, Thùng -> Box
};

export type Order = {
  id: string;
  customer: Customer;
  shippingAddress: Address;
  orderDate: string; // ISO string
  deliveryDate: string; // ISO string
  items: OrderItem[];
  status: OrderStatus;
};

export type DeliveryStatus = 'Cần giao' | 'Chờ giao' | 'Đang giao' | 'Đã giao' | 'Thất bại' | 'Đã hủy';

export type Delivery = {
  id: string;
  order: Order;
  vendor?: Vendor;
  deliveryDateTime?: string; // ISO string
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  status: DeliveryStatus;
};
