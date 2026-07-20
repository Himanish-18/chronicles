import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Folder } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { categoryService } from '@/services/categoryService';
import type { Category } from '@/types';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh]">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden gradient-hero pt-20 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary-600/20 blur-[120px]" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <Badge variant="primary" className="mb-6 text-sm px-4 py-1">
              Topics
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
          >
            Explore <span className="gradient-text">Categories</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto text-balance"
          >
            Find articles across different topics, technologies, and ideas.
          </motion.p>
        </div>
      </section>

      {/* ===== Categories Grid ===== */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link
                  to={`/blogs?category=${cat.slug}`}
                  className="group block h-full"
                >
                  <div
                    className="h-full px-8 py-10 rounded-2xl glass transition-all duration-300 hover:-translate-y-1 hover:shadow-card flex flex-col items-center justify-center text-center"
                    style={{ borderTop: `4px solid ${cat.color || '#7c3aed'}` }}
                  >
                    <div className="p-4 rounded-full bg-surface-800/50 mb-4 group-hover:scale-110 transition-transform">
                      <Folder className="text-surface-300 group-hover:text-white transition-colors" size={32} />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-surface-100 group-hover:text-primary-400 transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
