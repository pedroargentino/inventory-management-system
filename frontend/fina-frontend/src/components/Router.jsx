import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Inventory from '../pages/Inventory';
import ShoppingList from '../pages/ShoppingList';
import Recipes from '../pages/Recipes';
import Settings from '../pages/Settings';
import NotFound from '../pages/404';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Stock from '../pages/StockManagement';
import Logs from '../pages/LogsPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/Logs" element={<Logs />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/stock-management" element={<Stock />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;