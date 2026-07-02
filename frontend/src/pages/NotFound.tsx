import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <h1 className="font-heading text-[120px] font-bold gradient-text leading-none">404</h1>
        <h2 className="font-heading text-2xl font-bold text-surface-100 mt-2">Page not found</h2>
        <p className="text-surface-400 mt-3">
          The page you're looking for doesn't exist or has been moved to a different location.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link to="/">
            <Button><Home size={16} /> Go Home</Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft size={16} /> Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
