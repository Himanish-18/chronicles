import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export function About() {
  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden gradient-hero pt-20 pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary-600/20 blur-[120px]" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <Badge variant="primary" className="mb-6 text-sm px-4 py-1">
              About Chronicles
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
          >
            Empowering <span className="gradient-text">Creators</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto text-balance"
          >
            Chronicles is a modern publishing platform designed for writers, thinkers, and storytellers who want to share their voice with the world.
          </motion.p>
        </div>
      </section>

      {/* ===== Content ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-surface-100 font-heading">Our Mission</h2>
            <p className="text-surface-300">
              We believe that everyone has a story worth telling. Our mission is to provide a beautiful, distraction-free environment where ideas can flourish and connect with readers globally.
            </p>
            
            <h2 className="text-surface-100 font-heading mt-12">Why Choose Us?</h2>
            <p className="text-surface-300">
              Unlike traditional blogging platforms that are cluttered with ads and complex interfaces, Chronicles focuses on what truly matters: your content.
            </p>
            <ul className="text-surface-300">
              <li><strong>Minimalist Design:</strong> A clean interface that puts your words front and center.</li>
              <li><strong>Developer Friendly:</strong> First-class support for code snippets, markdown, and technical writing.</li>
              <li><strong>Community Driven:</strong> Connect with like-minded individuals and grow your audience organically.</li>
            </ul>

            <h2 className="text-surface-100 font-heading mt-12">Join the Journey</h2>
            <p className="text-surface-300">
              Whether you're sharing your latest tech discoveries, personal experiences, or creative fiction, there's a place for you here. Start writing today and become part of our growing community.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
