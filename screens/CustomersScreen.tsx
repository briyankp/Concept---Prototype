
import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { SAMPLE_CUSTOMERS, SAMPLE_BILLS } from '../constants';
import { Customer, BillStatus, Screen } from '../types';
import { useNavigation } from '../App';
import { differenceInDays, format } from 'date-fns';

const CustomerCard: React.FC<{ customer: Customer; nextBillDue: Date | null }> = ({ customer, nextBillDue }) => {
  const { navigate } = useNavigation();

  const daysUntilDue = nextBillDue ? differenceInDays(nextBillDue, new Date()) : null;
  
  let dueDateText = 'No upcoming bills';
  let dueDateColor = 'text-gray-500';

  if (daysUntilDue !== null) {
    if (daysUntilDue < 0) {
      dueDateText = `Overdue by ${Math.abs(daysUntilDue)} days`;
      dueDateColor = 'text-red-600 font-bold';
    } else if (daysUntilDue === 0) {
      dueDateText = 'Due today';
      dueDateColor = 'text-red-600 font-bold';
    } else if (daysUntilDue <= 3) {
      dueDateText = `Due in ${daysUntilDue} days`;
      dueDateColor = 'text-red-500 font-semibold';
    } else {
      dueDateText = `Due on ${format(nextBillDue!, 'MMM d')}`;
      dueDateColor = 'text-green-600';
    }
  }

  return (
    <div onClick={() => navigate(Screen.CustomerDetail, { customerId: customer.id })} className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center cursor-pointer">
      <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center font-bold text-xl mr-4">
        {customer.name.charAt(0)}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-800">{customer.name}</h3>
            <div className="flex items-center text-sm bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1.586l-1.707 1.707A1 1 0 003 8v6a1 1 0 001 1h2a1 1 0 001-1V8a1 1 0 00-1.707-.707L5 5.586V3a1 1 0 00-1-1zm11 1a1 1 0 00-1 1v2.586l-1.707 1.707A1 1 0 0013 9v5a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1.707-.707L15 6.586V4a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {customer.loyaltyPoints}
            </div>
        </div>
        <p className="text-sm text-gray-500">{customer.phone}</p>
        <p className={`text-sm mt-1 ${dueDateColor}`}>{dueDateText}</p>
      </div>
       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
    </div>
  );
};

const CustomersScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const customerBills = useMemo(() => {
    return SAMPLE_CUSTOMERS.map(customer => {
      const bills = SAMPLE_BILLS
        .filter(bill => bill.customerId === customer.id && (bill.status === BillStatus.Due || bill.status === BillStatus.Overdue))
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
      return { ...customer, nextBillDue: bills.length > 0 ? bills[0].dueDate : null };
    });
  }, []);

  const filteredCustomers = useMemo(() => {
    return customerBills
      .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(c => {
        if (filter === 'dueThisWeek') {
          if (!c.nextBillDue) return false;
          const days = differenceInDays(c.nextBillDue, new Date());
          return days >= 0 && days <= 7;
        }
        return true;
      });
  }, [customerBills, searchTerm, filter]);

  return (
    <div className="bg-gray-50 min-h-full">
      <Header title="Customers (ग्राहक)" />
      <div className="p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
          </div>
        </div>

        <div className="flex space-x-2 mb-4">
          <FilterButton label="All Customers" isActive={filter === 'all'} onClick={() => setFilter('all')} />
          <FilterButton label="Due This Week" isActive={filter === 'dueThisWeek'} onClick={() => setFilter('dueThisWeek')} />
        </div>
        
        {filteredCustomers.map(customer => (
          <CustomerCard key={customer.id} customer={customer} nextBillDue={customer.nextBillDue} />
        ))}
      </div>
    </div>
  );
};

const FilterButton: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-semibold ${
      isActive ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border'
    }`}
  >
    {label}
  </button>
);

export default CustomersScreen;
