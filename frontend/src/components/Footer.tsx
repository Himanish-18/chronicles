import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from '@/components/icons';
import { APP_NAME } from '@/utils/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '/changelog' },
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Blog', href: '/blogs' },
      { label: 'Support', href: '/support' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Privacy', href: '/privacy' },
    ],
  };

  return (
    <footer className="border-t border-surface-800 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-heading font-bold text-lg text-surface-100">{APP_NAME}</span>
            </Link>
            <p className="mt-3 text-sm text-surface-500 max-w-xs">
              A modern publishing platform for developers and creators. Share your ideas with the world.
            </p>
            <div className="mt-4 flex gap-3">
              <SocialLink href="https://twitter.com" icon={<TwitterIcon size={18} />} label="Twitter" />
              <SocialLink href="https://github.com" icon={<GithubIcon size={18} />} label="GitHub" />
              <SocialLink href="https://linkedin.com" icon={<LinkedinIcon size={18} />} label="LinkedIn" />
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-sm text-surface-200 mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-surface-500 hover:text-surface-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-surface-500">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-surface-500 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500" /> by the Chronicles team
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-white/5 transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
