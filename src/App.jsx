import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard     from './pages/Dashboard';
import Expenses      from './pages/Expenses';
import AddExpense    from './pages/AddExpense';
import Categories    from './pages/Categories';
import Budgets       from './pages/Budgets';
import Insights      from './pages/Insights';
import SavingPlan    from './pages/SavingPlan';
import MonthlyStory  from './pages/MonthlyStory';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-[#f8f7f2] text-[#17261f]">
          <div className="status-bar-cover md:hidden" />
          <Sidebar />
          <main className="app-main flex-1 w-full md:ml-20 lg:ml-64 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-[1400px] mx-auto transition-all">
            <Routes>
              <Route path="/"           element={<Dashboard />} />
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
    </AppProvider>
  );
}
