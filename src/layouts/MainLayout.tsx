import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="hero-glow" />
      <div className="hero-glow-2" />
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 relative z-10"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
