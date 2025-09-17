import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import { useNavigation } from '../App';
import { SAMPLE_CUSTOMERS, SAMPLE_BILLS, ADHIKARI_DETAILS } from '../constants';
import { Bill, BillStatus, Screen, BillType, Customer } from '../types';
import { format, isPast, differenceInDays } from 'date-fns';

const CustomerDetailScreen: React.FC = () => {
  const { params, navigate } = useNavigation();
  const customerId = params.customerId;

  const [showReminderModalFor, setShowReminderModalFor] = useState<Bill | null>(null);
  const [reminderSentForBillId, setReminderSentForBillId] = useState<string | null>(null);

  const customer = useMemo(() => SAMPLE_CUSTOMERS.find(c => c.id === customerId), [customerId]);
  const bills = useMemo(() => SAMPLE_BILLS.filter(b => b.customerId === customerId).sort((a,b) => b.dueDate.getTime() - a.dueDate.getTime()), [customerId]);
  
  const upcomingBills = bills.filter(b => b.status === BillStatus.Due || b.status === BillStatus.Overdue);
  const historyBills = bills.filter(b => b.status === BillStatus.Paid);

  const handleSendReminder = (bill: Bill) => {
    setShowReminderModalFor(null);
    setReminderSentForBillId(bill.id);
    setTimeout(() => {
        setReminderSentForBillId(null);
    }, 2500);
  };

  if (!customer) {
    return (
      <div>
        <Header title="Customer Not Found" showBackButton />
        <p className="p-4">Could not find customer data.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <Header title={customer.name} showBackButton />
      
      {/* Customer Info Card */}
      <div className="p-4">
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-center">
            <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center font-bold text-4xl mx-auto">
                {customer.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold mt-3">{customer.name}</h2>
            <p className="text-gray-500">{customer.phone}</p>
            <div className="mt-4 inline-flex items-center text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1.586l-1.707 1.707A1 1 0 003 8v6a1 1 0 001 1h2a1 1 0 001-1V8a1 1 0 00-1.707-.707L5 5.586V3a1 1 0 00-1-1zm11 1a1 1 0 00-1 1v2.586l-1.707 1.707A1 1 0 0013 9v5a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1.707-.707L15 6.586V4a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {customer.loyaltyPoints} Loyalty Points
            </div>
            <button className="text-sm text-orange-500 mt-1">Redeem Rewards</button>
        </div>
      </div>

      {/* Upcoming Bills */}
      <div className="px-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Upcoming Bills (बकाया बिल)</h3>
        {upcomingBills.length > 0 ? (
          upcomingBills.map(bill => <BillCard key={bill.id} bill={bill} onSendReminder={() => setShowReminderModalFor(bill)} reminderSent={reminderSentForBillId === bill.id} />)
        ) : (
          <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">No upcoming bills. Looks all clear!</p>
        )}
      </div>

      {/* Payment History */}
      <div className="p-4 mt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Payment History</h3>
        {historyBills.length > 0 ? (
          historyBills.map(bill => <BillCard key={bill.id} bill={bill} onSendReminder={() => {}} />)
        ) : (
          <p className="text-gray-500">No payment history yet.</p>
        )}
      </div>

      <div className="p-2 absolute bottom-20 left-0 right-0 max-w-sm mx-auto">
        <p className="text-center text-xs text-gray-400 mb-2">Bills fetched automatically</p>
        <div className="bg-gray-200 px-3 py-1 rounded-full text-center text-xs text-gray-500 font-semibold">
          Powered by NPCI UPMS
        </div>
      </div>

      {showReminderModalFor && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full shadow-xl">
                <h2 className="text-xl font-bold mb-2 text-gray-800">Confirm Reminder</h2>
                <p className="text-gray-600 mb-4">An SMS will be sent to {customer.name} ({customer.phone}).</p>
                <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 mb-6">
                    <p className="text-sm font-semibold text-gray-800 mb-1">Message Preview:</p>
                    <p className="text-sm text-gray-600">
                        "Dear {customer.name}, your {showReminderModalFor.type} bill of ₹{showReminderModalFor.amount} is due on {format(showReminderModalFor.dueDate, 'MMM d')}. Please visit your Spice Money Adhikari to pay. Adhikari: {ADHIKARI_DETAILS.name}, Ph: {ADHIKARI_DETAILS.phone}, Address: {ADHIKARI_DETAILS.address}."
                    </p>
                </div>
                <div className="flex justify-end space-x-3">
                    <button onClick={() => setShowReminderModalFor(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold">Cancel</button>
                    <button onClick={() => handleSendReminder(showReminderModalFor)} className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold">Confirm & Send</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

const BillCard: React.FC<{ bill: Bill, onSendReminder: () => void, reminderSent?: boolean }> = ({ bill, onSendReminder, reminderSent = false }) => {
    const isActionable = bill.status === BillStatus.Due || bill.status === BillStatus.Overdue;
    const { navigate } = useNavigation();

    const daysDiff = differenceInDays(bill.dueDate, new Date());
    let dateColor = 'text-gray-500';
    let dueDateText: string;

    if (isActionable) {
        if (daysDiff < 0) {
            dateColor = 'text-red-600 font-bold';
            dueDateText = `Overdue by ${Math.abs(daysDiff)} days`;
        } else if (daysDiff === 0) {
            dateColor = 'text-red-600 font-bold';
            dueDateText = 'Due today';
        } else if (daysDiff === 1) {
            dateColor = 'text-red-500 font-semibold';
            dueDateText = 'Due tomorrow';
        } else if (daysDiff <= 3) {
            dateColor = 'text-red-500 font-semibold';
            dueDateText = `Due in ${daysDiff} days`;
        } else {
            dateColor = 'text-green-600';
            dueDateText = `Due on ${format(bill.dueDate, 'MMM d, yyyy')}`;
        }
    } else {
        dateColor = 'text-green-600';
        dueDateText = `Paid on ${format(bill.paidDate!, 'MMM d, yyyy')}`;
    }

    const getIconForBillType = (type: BillType) => {
        switch (type) {
            case BillType.Electricity: return '⚡️';
            case BillType.Water: return '💧';
            case BillType.Gas: return '🔥';
            case BillType.Mobile: return '📱';
            case BillType.DTH: return '📺';
            default: return '📄';
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center">
                    <div className="text-2xl mr-3">{getIconForBillType(bill.type)}</div>
                    <div>
                        <p className="font-bold text-gray-800">{bill.type}</p>
                        <p className={`text-sm ${dateColor}`}>
                           {dueDateText}
                        </p>
                    </div>
                </div>
                <p className="text-lg font-bold text-gray-900">₹{bill.amount}</p>
            </div>
            {isActionable && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-2">
                    <button onClick={onSendReminder} disabled={reminderSent} className="flex-1 text-sm bg-orange-100 text-orange-600 font-semibold py-2 px-4 rounded-lg disabled:bg-green-100 disabled:text-green-600 transition-colors">
                      {reminderSent ? 'Sent ✓' : 'Send Reminder'}
                    </button>
                    <button onClick={() => navigate(Screen.BillPay, { billId: bill.id, customerId: bill.customerId })} className="flex-1 text-sm bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg">Pay Now</button>
                </div>
            )}
        </div>
    );
}

export default CustomerDetailScreen;