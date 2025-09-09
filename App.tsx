
import React, { useState, useCallback, createContext, useContext } from 'react';
import { Screen } from './types';
import DashboardScreen from './screens/DashboardScreen';
import CustomersScreen from './screens/CustomersScreen';
import CustomerDetailScreen from './screens/CustomerDetailScreen';
import BulkReminderScreen from './screens/BulkReminderScreen';
import BillPaymentFlow from './screens/BillPaymentFlow';
import BottomNav from './components/BottomNav';

interface NavigationParams {
  customerId?: string;
  flow?: 'new' | 'existing';
  [key: string]: any;
}

interface NavigationContextType {
  navigate: (screen: Screen, params?: NavigationParams) => void;
  goBack: () => void;
  params: NavigationParams;
}

export const NavigationContext = createContext<NavigationContextType | null>(null);

const App: React.FC = () => {
  const [history, setHistory] = useState<{ screen: Screen; params: NavigationParams }[]>([
    { screen: Screen.Dashboard, params: {} },
  ]);

  const currentNavigationState = history[history.length - 1];

  const navigate = useCallback((screen: Screen, params: NavigationParams = {}) => {
    setHistory((prevHistory) => [...prevHistory, { screen, params }]);
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      setHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  }, [history.length]);

  const renderScreen = () => {
    switch (currentNavigationState.screen) {
      case Screen.Dashboard:
        return <DashboardScreen />;
      case Screen.Customers:
        return <CustomersScreen />;
      case Screen.CustomerDetail:
        return <CustomerDetailScreen />;
      case Screen.BulkReminder:
        return <BulkReminderScreen />;
      case Screen.BillPay:
        return <BillPaymentFlow />;
      default:
        return <DashboardScreen />;
    }
  };

  const isTabScreen = [Screen.Dashboard, Screen.Customers].includes(currentNavigationState.screen);

  return (
    <NavigationContext.Provider value={{ navigate, goBack, params: currentNavigationState.params }}>
      <div className="bg-gray-200 flex justify-center items-start min-h-screen font-sans">
        <div className="w-full max-w-sm bg-white shadow-2xl min-h-screen flex flex-col relative">
          <main className="flex-grow overflow-y-auto pb-20">
            {renderScreen()}
          </main>
          {isTabScreen && <BottomNav activeTab={currentNavigationState.screen} />}
        </div>
      </div>
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export default App;
