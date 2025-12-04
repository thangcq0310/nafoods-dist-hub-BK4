
"use client"

import type { ReactNode } from 'react';
import { createContext, useState, useCallback } from 'react';
import type { Order, Delivery, Customer, Product, Vendor, OrderStatus, DeliveryStatus, OrderItem } from '@/lib/types';
import { 
  orders as mockOrders,
  deliveries as mockDeliveries,
  customers as mockCustomers,
  products as mockProducts,
  vendors as mockVendors
} from '@/lib/mock-data';

export interface DataContextType {
  orders: Order[];
  deliveries: Delivery[];
  customers: Customer[];
  products: Product[];
  vendors: Vendor[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus) => void;
  createOrder: (newOrder: Omit<Order, 'id' | 'orderDate' | 'confirmationDate'>) => void;
  createDelivery: (newDeliveryData: { orderId: string, vendorId: string, deliveryDateTime: string, driverName: string, driverPhone: string, vehicleNumber: string, deliveryFee?: number }) => void;
  updateDelivery: (deliveryId: string, updatedData: { vendorId: string, deliveryDateTime: string, driverName: string, driverPhone: string, vehicleNumber: string, deliveryFee?: number }) => void;
  createProduct: (newProduct: Omit<Product, 'id' | 'price'>) => void;
  createCustomer: (newCustomer: Omit<Customer, 'id'>) => void;
  createVendor: (newVendor: Omit<Vendor, 'id'>) => void;
}

export const DataContext = createContext<DataContextType | null>(null);

const staticDate = new Date(2024, 6, 20, 10, 30, 0).toISOString();

export function DataProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status };
          if (status === 'Confirmed' && !order.confirmationDate) {
            updatedOrder.confirmationDate = staticDate;
          }
          return updatedOrder;
        }
        return order;
      })
    );

    // If an order is confirmed, it needs a delivery record
    if (status === 'Confirmed') {
      const orderExistsInDeliveries = deliveries.some(d => d.order.id === orderId);
      if (!orderExistsInDeliveries) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          const newDelivery: Delivery = {
            id: `GH-${String(deliveries.length + 1).padStart(5, '0')}`,
            order,
            status: 'Cần giao',
          };
          setDeliveries(prev => [...prev, newDelivery]);
        }
      }
    }

    // If an order is canceled, cancel the corresponding delivery
    if (status === 'Canceled') {
      const deliveryToCancel = deliveries.find(d => d.order.id === orderId);
      if (deliveryToCancel && deliveryToCancel.status !== 'Đã giao' && deliveryToCancel.status !== 'Thất bại') {
        setDeliveries(prevDeliveries =>
          prevDeliveries.map(delivery =>
            delivery.id === deliveryToCancel.id ? { ...delivery, status: 'Đã hủy' } : delivery
          )
        );
      }
    }
  }, [orders, deliveries]);
  
  const updateDeliveryStatus = useCallback((deliveryId: string, status: DeliveryStatus) => {
    setDeliveries(prevDeliveries =>
      prevDeliveries.map(delivery =>
        delivery.id === deliveryId ? { ...delivery, status } : delivery
      )
    );
  }, []);

  const createOrder = useCallback((newOrderData: Omit<Order, 'id' | 'orderDate' | 'confirmationDate'>) => {
    const newOrder: Order = {
      ...newOrderData,
      id: `DH-${String(orders.length + 1).padStart(5, '0')}`,
      orderDate: staticDate,
      status: 'Pending'
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  }, [orders.length]);

  const createDelivery = useCallback((newDeliveryData: { orderId: string, vendorId: string, deliveryDateTime: string, driverName: string, driverPhone: string, vehicleNumber: string, deliveryFee?: number }) => {
    setDeliveries(prevDeliveries => 
      prevDeliveries.map(delivery => {
        if (delivery.order.id === newDeliveryData.orderId) {
          const vendor = vendors.find(v => v.id === newDeliveryData.vendorId);
          return {
            ...delivery,
            vendor,
            deliveryDateTime: newDeliveryData.deliveryDateTime,
            driverName: newDeliveryData.driverName,
            driverPhone: newDeliveryData.driverPhone,
            vehicleNumber: newDeliveryData.vehicleNumber,
            deliveryFee: newDeliveryData.deliveryFee,
            status: 'Chờ giao' as DeliveryStatus,
          };
        }
        return delivery;
      })
    );
  }, [vendors]);

  const updateDelivery = useCallback((deliveryId: string, updatedData: { vendorId: string, deliveryDateTime: string, driverName: string, driverPhone: string, vehicleNumber: string, deliveryFee?: number }) => {
    setDeliveries(prevDeliveries => 
      prevDeliveries.map(delivery => {
        if (delivery.id === deliveryId) {
          const vendor = vendors.find(v => v.id === updatedData.vendorId);
          return {
            ...delivery,
            vendor,
            deliveryDateTime: updatedData.deliveryDateTime,
            driverName: updatedData.driverName,
            driverPhone: updatedData.driverPhone,
            vehicleNumber: updatedData.vehicleNumber,
            deliveryFee: updatedData.deliveryFee,
          };
        }
        return delivery;
      })
    );
  }, [vendors]);

  const createProduct = useCallback((newProductData: Omit<Product, 'id' | 'price'>) => {
    const newProduct: Product = {
      ...newProductData,
      price: 0, // Default price
      id: `P-${String(products.length + 1).padStart(3, '0')}`,
    };
    setProducts(prev => [newProduct, ...prev]);
  }, [products.length]);

  const createCustomer = useCallback((newCustomerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...newCustomerData,
      id: `C-${String(customers.length + 1).padStart(3, '0')}`,
    };
    setCustomers(prev => [newCustomer, ...prev]);
  }, [customers.length]);

  const createVendor = useCallback((newVendorData: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...newVendorData,
      id: `V-${String(vendors.length + 1).padStart(3, '0')}`,
    };
    setVendors(prev => [newVendor, ...prev]);
  }, [vendors.length]);

  const value = {
    orders,
    deliveries,
    customers,
    products,
    vendors,
    updateOrderStatus,
    updateDeliveryStatus,
    createOrder,
    createDelivery,
    updateDelivery,
    createProduct,
    createCustomer,
    createVendor,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
