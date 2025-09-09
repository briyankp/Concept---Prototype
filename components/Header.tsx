
import React from 'react';
import { useNavigation } from '../App';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const { goBack } = useNavigation();

  return (
    <div className="bg-white sticky top-0 z-10 p-4 flex items-center shadow-md">
      {showBackButton && (
        <button onClick={goBack} className="mr-4 text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
    </div>
  );
};

export default Header;
