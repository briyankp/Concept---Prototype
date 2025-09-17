
import React, { useMemo } from 'react';
import { useNavigation } from '../App';
import { Screen, BillStatus } from '../types';
import { SAMPLE_CUSTOMERS, SAMPLE_BILLS } from '../constants';

const DashboardScreen: React.FC = () => {
  const { navigate } = useNavigation();

  const upcomingBills = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.setDate(now.getDate() + 7));
    return SAMPLE_BILLS.filter(
      (bill) =>
        (bill.status === BillStatus.Due || bill.status === BillStatus.Overdue) &&
        bill.dueDate <= nextWeek
    );
  }, []);

  return (
    <div className="bg-gray-100 min-h-full">
      <div className="bg-orange-500 text-white p-4 pb-16">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Adhikari!</h1>
            <p className="text-sm opacity-90">Here's your business summary</p>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-500 font-bold text-xl">
            A
          </div>
        </div>
      </div>

      <div className="p-4 -mt-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-500">Customers Registered</p>
            <p className="text-xl font-bold text-gray-800">2</p>
            <p className="text-xs text-gray-400">this month</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-500">Bills Paid on Time</p>
            <p className="text-xl font-bold text-gray-800">32</p>
            <p className="text-xs text-gray-400">this month</p>
          </div>
        </div>

        {/* My Customers Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">My Customers (मेरे ग्राहक)</h2>
          <div className="flex items-center justify-between text-gray-600 mb-4">
            <div>
              <p className="text-2xl font-bold">{SAMPLE_CUSTOMERS.length}</p>
              <p className="text-sm">Lifetime Registered</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-500">{upcomingBills.length}</p>
              <p className="text-sm">Upcoming Payments</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(Screen.Customers)}
              className="flex-1 bg-orange-100 text-orange-600 font-semibold py-2 px-4 rounded-lg"
            >
              View All Customers
            </button>
            <button
              onClick={() => navigate(Screen.BulkReminder)}
              className="flex-1 bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm"
            >
              Send Reminders
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <QuickActionButton label="Bill Pay" onClick={() => navigate(Screen.BillPay, { flow: 'new' })} icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            } />
            <QuickActionButton label="New Customer" onClick={() => navigate(Screen.BillPay, { flow: 'new' })} icon={
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            } />
            <QuickActionButton label="Reports" onClick={() => {}} icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            } />
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{ label: string; icon: JSX.Element; onClick: () => void }> = ({ label, icon, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100">
    {icon}
    <span className="text-sm text-gray-700 mt-2">{label}</span>
  </button>
);

export default DashboardScreen;