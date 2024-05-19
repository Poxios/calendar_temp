import React, { useState } from 'react';
import Calendar from './Calendar';
import WeeklyView from './WeeklyView';
import BottomNavigation from './BottomNavigation';
import './App.css';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'monthly' | 'weekly'>('monthly');

  return (
    <div className="App">
      {currentView === 'monthly' ? <Calendar /> : <WeeklyView />}
      <BottomNavigation currentView={currentView} onChangeView={setCurrentView} />
    </div>
  );
};

export default App;
