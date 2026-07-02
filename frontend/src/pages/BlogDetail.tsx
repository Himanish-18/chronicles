import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { AuthorCard } from '@/components/AuthorCard';
import { BlogCard } from '@/components/BlogCard';
import { formatDate, formatNumber } from '@/utils/formatDate';
import type { Blog, User } from '@/types';

// Mock blog detail
const mockAuthor: User = {
  id: '1', name: 'Sarah Chen', email: 'sarah@chronicles.dev',
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah',
  bio: 'Senior Engineer at Vercel. Writing about web performance, DevOps, and the future of React. Open source contributor.',
  role: 'user', createdAt: '2025-01-01T00:00:00Z',
  socialLinks: { twitter: 'https://twitter.com', github: 'https://github.com', website: 'https://sarahchen.dev' },
};

const mockBlog: Blog = {
  id: '1', title: 'Building Scalable Microservices with Docker and Kubernetes',
  slug: 'building-scalable-microservices', excerpt: '',
  content: `
## Introduction

Microservices architecture has become the de facto standard for building large-scale applications. In this comprehensive guide, we'll explore how to design, build, and deploy microservices using Docker containers orchestrated by Kubernetes.

## Why Microservices?

Traditional monolithic architectures can become unwieldy as applications grow. Microservices offer several advantages:

- **Independent deployment** — Each service can be deployed independently
- **Technology diversity** — Teams can choose the best stack for their service
- **Scalability** — Scale individual services based on demand
- **Fault isolation** — A failure in one service doesn't bring down the entire system

## Containerization with Docker

Docker provides a consistent runtime environment for your services. Here's a production-ready Dockerfile:

\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

## Kubernetes Orchestration

Kubernetes manages the lifecycle of your containers. A basic deployment manifest:

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
    spec:
      containers:
        - name: api
          image: registry.example.com/api:latest
          ports:
            - containerPort: 3000
\`\`\`

## Best Practices

1. **Health Checks** — Implement liveness and readiness probes
2. **Circuit Breakers** — Handle cascading failures gracefully
3. **Centralized Logging** — Use ELK stack or similar
4. **Service Mesh** — Consider Istio for advanced traffic management

## Conclusion

Building microservices is a journey. Start small, containerize early, and automate everything. The combination of Docker and Kubernetes provides a powerful foundation for scalable applications.
  `,
  coverImage: 'https://picsum.photos/seed/docker/1600/800',
  category: { id: '3', name: 'DevOps', slug: 'devops', color: '#06b6d4' },
  tags: ['docker', 'kubernetes', 'microservices', 'devops'],
  author: mockAuthor, status: 'published', readTime: 8,
  views: 12400, likes: 342, commentsCount: 28, isFeatured: true,
  publishedAt: '2026-06-15T10:00:00Z', createdAt: '2026-06-15T10:00:00Z', updatedAt: '2026-06-15T10:00:00Z',
};

const relatedBlogs: Blog[] = [
  { ...mockBlog, id: '2', title: 'Zero-Downtime Deployments with GitHub Actions', slug: 'zero-downtime-deployments', coverImage: 'https://picsum.photos/seed/cicd/800/400', views: 8200, readTime: 6 },
  { ...mockBlog, id: '3', title: 'Docker Compose for Production Environments', slug: 'docker-compose-production', coverImage: 'https://picsum.photos/seed/compose/800/400', views: 6100, readTime: 10 },
  { ...mockBlog, id: '4', title: 'Monitoring Kubernetes with Prometheus and Grafana', slug: 'k8s-monitoring', coverImage: 'https://picsum.photos/seed/monitor/800/400', views: 5400, readTime: 12 },
];

export function BlogDetail() {
  const { slug: _slug } = useParams();

  const blog = mockBlog;

  // Simple markdown-to-html rendering for code blocks, headings, lists, etc.
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith('```')) {
        const lang = line.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <pre key={key++} className="my-6 rounded-xl bg-surface-900 border border-surface-800 p-4 overflow-x-auto">
            <code className="text-sm font-mono text-surface-200">{codeLines.join('\n')}</code>
            {lang && <span className="block mt-2 text-xs text-surface-600 uppercase">{lang}</span>}
          </pre>,
        );
        i++;
        continue;
      }

      // Headings
      if (line.startsWith('## ')) {
        elements.push(<h2 key={key++} className="text-2xl font-heading font-bold text-surface-100 mt-10 mb-4">{line.slice(3)}</h2>);
        i++; continue;
      }

      // List items
      if (line.startsWith('- **') || line.startsWith('1. **')) {
        elements.push(
          <li key={key++} className="ml-4 text-surface-300 leading-relaxed list-disc marker:text-primary-500" dangerouslySetInnerHTML={{ __html: line.replace(/^[-\d.]+\s*/, '').replace(/\*\*(.+?)\*\*/g, '<strong class="text-surface-100">$1</strong>').replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-surface-800 text-primary-300 text-sm font-mono">$1</code>') }} />,
        );
        i++; continue;
      }

      // Paragraph
      if (line.trim()) {
        elements.push(
          <p key={key++} className="text-surface-300 leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-surface-100">$1</strong>').replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-surface-800 text-primary-300 text-sm font-mono">$1</code>') }} />,
        );
      }
      i++;
    }
    return elements;
  };

  return (
    <article>
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 -mt-32 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Meta */}
          <Badge color={blog.category.color} className="mb-4">{blog.category.name}</Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100 leading-tight">
            {blog.title}
          </h1>

          {/* Author bar */}
          <div className="flex items-center justify-between mt-6 pb-6 border-b border-surface-800">
            <div className="flex items-center gap-3">
              <Avatar src={blog.author.avatar} alt={blog.author.name} size="md" />
              <div>
                <p className="text-sm font-medium text-surface-200">{blog.author.name}</p>
                <p className="text-xs text-surface-500">
                  {formatDate(blog.publishedAt || blog.createdAt)} · {blog.readTime} min read
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ActionButton icon={<Heart size={18} />} label="Like" count={blog.likes} />
              <ActionButton icon={<MessageCircle size={18} />} label="Comment" count={blog.commentsCount} />
              <ActionButton icon={<Bookmark size={18} />} label="Bookmark" />
              <ActionButton icon={<Share2 size={18} />} label="Share" />
            </div>
          </div>

          {/* Content */}
          <div className="py-8">
            {renderContent(blog.content)}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 py-6 border-t border-surface-800">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="outline">#{tag}</Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 py-4 text-sm text-surface-500">
            <span className="flex items-center gap-1"><Eye size={16} /> {formatNumber(blog.views)} views</span>
            <span className="flex items-center gap-1"><Heart size={16} /> {formatNumber(blog.likes)} likes</span>
            <span className="flex items-center gap-1"><MessageCircle size={16} /> {blog.commentsCount} comments</span>
          </div>

          {/* Author Card */}
          <AuthorCard author={blog.author} className="my-8" />

          {/* Comments placeholder */}
          <div className="mt-10">
            <h3 className="font-heading text-xl font-bold text-surface-100 mb-6">
              Comments ({blog.commentsCount})
            </h3>
            <div className="glass rounded-2xl p-4">
              <textarea
                placeholder="Share your thoughts..."
                className="w-full bg-transparent rounded-xl border border-surface-700 p-3 text-sm text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none min-h-[100px]"
                aria-label="Write a comment"
              />
              <div className="flex justify-end mt-3">
                <Button size="sm">Post Comment</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Posts */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 mt-10 border-t border-surface-800">
        <h3 className="font-heading text-2xl font-bold text-surface-100 mb-8">Related Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedBlogs.map((b) => <BlogCard key={b.id} blog={b} />)}
        </div>
      </div>
    </article>
  );
}

function ActionButton({ icon, label, count }: { icon: React.ReactNode; label: string; count?: number }) {
  return (
    <button
      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-surface-500 hover:text-primary-400 hover:bg-white/5 transition-colors text-sm cursor-pointer"
      aria-label={label}
    >
      {icon}
      {count !== undefined && <span className="text-xs">{formatNumber(count)}</span>}
    </button>
  );
}
