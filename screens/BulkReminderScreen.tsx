
import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { SAMPLE_CUSTOMERS, SAMPLE_BILLS } from '../constants';
import { Customer, Bill, BillStatus } from '../types';
import { useNavigation } from '../App';
import { format, differenceInDays } from 'date-fns';

interface CustomerWithBill extends Customer {
  bill: Bill;
}

const BulkReminderScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [remindersSent, setRemindersSent] = useState(false);

  const customersWithDueBills = useMemo(() => {
    const dueCustomers: CustomerWithBill[] = [];
    SAMPLE_BILLS.forEach(bill => {
      if (bill.status === BillStatus.Due || bill.status === BillStatus.Overdue) {
        const customer = SAMPLE_CUSTOMERS.find(c => c.id === bill.customerId);
        if (customer) {
          dueCustomers.push({ ...customer, bill });
        }
      }
    });
    return dueCustomers.sort((a,b) => a.bill.dueDate.getTime() - b.bill.dueDate.getTime());
  }, []);

  const handleSelect = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId) 
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === customersWithDueBills.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customersWithDueBills.map(c => c.id));
    }
  };

  const handleSendReminders = () => {
      setRemindersSent(true);
      setTimeout(() => {
        goBack();
      }, 2000);
  }

  if (remindersSent) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-white">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Success!</h2>
            <p className="text-gray-600 mt-2">Reminders sent to {selectedCustomers.length} customers.</p>
        </div>
      )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="Send Bulk Reminders" showBackButton />
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex justify-between items-center bg-white p-3 rounded-lg mb-4 shadow-sm">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedCustomers.length === customersWithDueBills.length}
              onChange={handleSelectAll}
              className="h-5 w-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label className="ml-3 text-gray-700 font-semibold">
              {selectedCustomers.length > 0 ? `${selectedCustomers.length} selected` : 'Select All'}
            </label>
          </div>
        </div>
        
        {customersWithDueBills.map(customer => (
          <ReminderCard 
            key={customer.id} 
            customer={customer}
            bill={customer.bill}
            isSelected={selectedCustomers.includes(customer.id)} 
            onSelect={handleSelect}
          />
        ))}
      </div>
      <div className="p-4 bg-white border-t">
        <button
          onClick={handleSendReminders}
          disabled={selectedCustomers.length === 0}
          className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Send Reminder to All ({selectedCustomers.length})
        </button>
      </div>
    </div>
  );
};

const ReminderCard: React.FC<{ customer: Customer; bill: Bill; isSelected: boolean; onSelect: (id: string) => void }> = ({ customer, bill, isSelected, onSelect }) => {
    const daysUntilDue = differenceInDays(bill.dueDate, new Date());
    const isOverdue = bill.status === BillStatus.Overdue;
    const isDueSoon = daysUntilDue <= 3 && !isOverdue;

  return (
    <div onClick={() => onSelect(customer.id)} className={`bg-white p-4 rounded-lg shadow-md mb-3 flex items-start cursor-pointer border-2 ${isSelected ? 'border-orange-500' : 'border-transparent'}`}>
      <input
        type="checkbox"
        checked={isSelected}
        readOnly
        className="h-5 w-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
      />
      <div className="ml-4 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-800">{customer.name}</h3>
          <p className="font-bold text-gray-800">₹{bill.amount}</p>
        </div>
        <p className="text-sm text-gray-500">{bill.type} Bill</p>
        <div className={`mt-1 text-sm font-semibold ${isOverdue || isDueSoon ? 'text-red-500' : 'text-gray-600'}`}>
            {isOverdue ? `Overdue by ${Math.abs(daysUntilDue)} days` : `Due on ${format(bill.dueDate, 'MMM d, yyyy')}`}
        </div>
      </div>
    </div>
  );
};

export default BulkReminderScreen;
