import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './store';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import OnboardingModal from './components/OnboardingModal';
import PaydayPromptModal from './components/PaydayPromptModal';
import Dashboard     from './pages/Dashboard';
import Expenses      from './pages/Expenses';
import AddExpense    from './pages/AddExpense';
import Categories    from './pages/Categories';
import Budgets       from './pages/Budgets';
import Insights      from './pages/Insights';
import SavingPlan    from './pages/SavingPlan';
import MonthlyStory  from './pages/MonthlyStory';
import { format } from 'date-fns';
import { scheduleAppNotifications } from './utils/notifications';

function AppContent() {
  const { state } = useApp();
  const [showSplash, setShowSplash] = useState(true);
  const [showPaydayPrompt, setShowPaydayPrompt] = useState(false);

  // Schedule native notifications on startup / settings change
  useEffect(() => {
    if (state.onboardingComplete && state.notificationSettings) {
      scheduleAppNotifications(state.notificationSettings, state.paydaySettings);
    }
  }, [state.onboardingComplete, state.notificationSettings, state.paydaySettings]);

  // Check if today matches the user's payday settings & notify or prompt
  useEffect(() => {
    if (!state.onboardingComplete || !state.paydaySettings) return;

    const { schedule, payDays = [], isVariable, lastPromptDate } = state.paydaySettings;
    const notifyOnPayday = state.notificationSettings?.notifyOnPayday ?? true;
    if (!isVariable && !notifyOnPayday) return;

    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    if (lastPromptDate === todayStr) return; // already prompted today

    const dayOfMonth = today.getDate();

    let isPayday = false;
    if (schedule === 'weekly') {
      // Check weekly on Friday (5) or if not prompted in last 7 days
      isPayday = today.getDay() === 5;
    } else {
      // Check if today is one of the designated pay days (or close to it)
      // Clamp to the month's length so day 29/30/31 still triggers in shorter months
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      isPayday = payDays.some(d => {
        const day = Math.min(Math.max(parseInt(d, 10) || 1, 1), 31);
        return Math.min(day, daysInMonth) === dayOfMonth;
      });
    }

    if (isPayday) {
      setShowPaydayPrompt(true);
    }
  }, [state.onboardingComplete, state.paydaySettings]);

  return (
    <>
      {/* 1. Small Startup Animation */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* 2. First-time Welcome & Salary Onboarding Modal */}
      {!state.onboardingComplete && !showSplash && (
        <OnboardingModal />
      )}

      {/* 3. Variable Payday Check-in Modal */}
      {showPaydayPrompt && !showSplash && state.onboardingComplete && (
        <PaydayPromptModal onClose={() => setShowPaydayPrompt(false)} />
      )}

      <BrowserRouter>
        <div className="flex min-h-screen bg-[#f8f7f2] text-[#17261f]">
          <div className="status-bar-cover md:hidden" />
          <Sidebar />
          <main className="app-main flex-1 w-full md:ml-20 lg:ml-64 max-w-[1400px] mx-auto transition-[margin] duration-200">
            <Routes>
              <Route path="/"           element={<Dashboard onOpenPaydayPrompt={() => setShowPaydayPrompt(true)} />} />
              <Route path="/expenses"   element={<Expenses />} />
              <Route path="/add"        element={<AddExpense />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/budgets"    element={<Budgets />} />
              <Route path="/insights"   element={<Insights />} />
              <Route path="/plan"       element={<SavingPlan />} />
              <Route path="/story"      element={<MonthlyStory />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
