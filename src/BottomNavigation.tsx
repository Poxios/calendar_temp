import React from 'react';

interface BottomNavigationProps {
  currentView: 'monthly' | 'weekly';
  onChangeView: (view: 'monthly' | 'weekly') => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentView, onChangeView }) => {
  return (
    <div className="bottom-navigation">
      <button
        className={currentView === 'monthly' ? 'active' : ''}
        onClick={() => onChangeView('monthly')}
      >
        Monthly
      </button>
      <button
        className={currentView === 'weekly' ? 'active' : ''}
        onClick={() => onChangeView('weekly')}
      >
        Weekly
      </button>
    </div>
  );
};

export default BottomNavigation;
