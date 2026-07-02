import { Globe } from 'lucide-react';
import { TwitterIcon, GithubIcon } from '@/components/icons';
import type { User } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface AuthorCardProps {
  author: User;
  showFollow?: boolean;
  className?: string;
}

export function AuthorCard({ author, showFollow = true, className }: AuthorCardProps) {
  return (
    <div className={cn('glass rounded-2xl p-6', className)}>
      <div className="flex items-start gap-4">
        <Avatar src={author.avatar} alt={author.name} size="lg" />
        <div className="flex-1 min-w-0">
          <h4 className="font-heading font-semibold text-surface-100">{author.name}</h4>
          {author.bio && <p className="mt-1 text-sm text-surface-400 line-clamp-2">{author.bio}</p>}

          {author.socialLinks && (
            <div className="mt-3 flex items-center gap-2">
              {author.socialLinks.twitter && (
                <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-surface-500 hover:text-primary-400 transition-colors" aria-label="Twitter">
                  <TwitterIcon size={16} />
                </a>
              )}
              {author.socialLinks.github && (
                <a href={author.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-surface-500 hover:text-primary-400 transition-colors" aria-label="GitHub">
                  <GithubIcon size={16} />
                </a>
              )}
              {author.socialLinks.website && (
                <a href={author.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-surface-500 hover:text-primary-400 transition-colors" aria-label="Website">
                  <Globe size={16} />
                </a>
              )}
            </div>
          )}
        </div>
        {showFollow && (
          <Button variant="outline" size="sm">
            Follow
          </Button>
        )}
      </div>
    </div>
  );
}
