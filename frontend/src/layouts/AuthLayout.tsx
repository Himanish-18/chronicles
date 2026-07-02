import { Outlet, Link } from 'react-router-dom';
import { APP_NAME } from '@/utils/constants';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Decorative Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-secondary-500/10" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-heading font-bold text-2xl text-surface-100">{APP_NAME}</span>
          </Link>
          <h1 className="font-heading text-4xl font-bold gradient-text max-w-md">
            Where Ideas Come Alive
          </h1>
          <p className="mt-4 text-lg text-surface-400 max-w-md">
            Join a community of developers and creators sharing their knowledge with the world.
          </p>
          {/* Abstract decorative circles */}
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-600/10 blur-3xl" />
          <div className="absolute top-20 -right-10 h-48 w-48 rounded-full bg-secondary-500/10 blur-3xl" />
        </div>
      </div>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
