import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import Login from './pages/Login';
import Admin from './pages/Admin';
import FAQ from './pages/FAQ';
import SizeGuide from './pages/SizeGuide';
import Contact from './pages/Contact';
import ExchangeReturn from './pages/ExchangeReturn';

function StoreFront() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/exchangereturn" element={<ExchangeReturn />} />
          <Route path="/shipping" element={<FAQ />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/*" element={<StoreFront />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
