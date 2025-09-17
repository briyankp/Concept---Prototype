import { Customer, Bill, BillType, BillStatus } from './types';

export const SAMPLE_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Ramesh Kumar', phone: '9876543210', loyaltyPoints: 120 },
  { id: '2', name: 'Sunita Devi', phone: '9876543211', loyaltyPoints: 250 },
  { id: '3', name: 'Mohit Singh', phone: '9876543212', loyaltyPoints: 50 },
  { id: '4', name: 'Priya Sharma', phone: '9876543213', loyaltyPoints: 400 },
  { id: '5', name: 'Rajesh Yadav', phone: '9876543214', loyaltyPoints: 80 },
  { id: '6', name: 'Anita Verma', phone: '9876543215', loyaltyPoints: 150 },
];

export const ADHIKARI_DETAILS = {
  name: 'Anil Kumar',
  phone: '9988776655',
  address: '123 Spice Point, Main Market, Noida'
};

const today = new Date();
export const SAMPLE_BILLS: Bill[] = [
  { 
    id: 'b1', customerId: '1', type: BillType.Electricity, amount: 850, 
    dueDate: new Date(today.setDate(today.getDate() + 2)), 
    status: BillStatus.Due 
  },
  { 
    id: 'b2', customerId: '2', type: BillType.Water, amount: 350, 
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
    status: BillStatus.Due 
  },
  { 
    id: 'b3', customerId: '3', type: BillType.Gas, amount: 1100, 
    dueDate: new Date(new Date().setDate(new Date().getDate() - 5)), 
    paidDate: new Date(new Date().setDate(new Date().getDate() - 5)), 
    status: BillStatus.Paid 
  },
  { 
    id: 'b4', customerId: '4', type: BillType.Mobile, amount: 399, 
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)), 
    status: BillStatus.Due 
  },
  { 
    id: 'b5', customerId: '5', type: BillType.DTH, amount: 450, 
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)), 
    status: BillStatus.Overdue 
  },
   { 
    id: 'b6', customerId: '1', type: BillType.Water, amount: 300, 
    dueDate: new Date(new Date().setDate(new Date().getDate() - 32)), 
    paidDate: new Date(new Date().setDate(new Date().getDate() - 32)),
    status: BillStatus.Paid 
  },
  { 
    id: 'b7', customerId: '2', type: BillType.Electricity, amount: 1200, 
    dueDate: new Date(new Date().setDate(new Date().getDate() - 29)), 
    paidDate: new Date(new Date().setDate(new Date().getDate() - 29)),
    status: BillStatus.Paid 
  },
];