
export enum Screen {
  Dashboard = 'DASHBOARD',
  Customers = 'CUSTOMERS',
  CustomerDetail = 'CUSTOMER_DETAIL',
  BulkReminder = 'BULK_REMINDER',
  BillPay = 'BILL_PAY',
  Rewards = 'REWARDS',
  Profile = 'PROFILE',
}

export enum BillType {
  Electricity = 'Electricity',
  Water = 'Water',
  Gas = 'Gas',
  Mobile = 'Mobile Recharge',
  DTH = 'DTH Recharge',
}

export enum BillStatus {
  Due = 'Due',
  Paid = 'Paid',
  Overdue = 'Overdue',
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
}

export interface Bill {
  id: string;
  customerId: string;
  type: BillType;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: BillStatus;
}
