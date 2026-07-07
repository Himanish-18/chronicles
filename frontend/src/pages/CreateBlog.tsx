import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, Save, Send, Eye, Bold, Italic, Code, List, Heading, Link2, Quote, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { blogService } from '@/services/blogService';
import { categoryService } from '@/services/categoryService';
import type { Category } from '@/types';

export function CreateBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await categoryService.getAll();
        setCategories(cats);
        if (id) {
          const myBlogs = await blogService.getMyBlogs();
          const existing = myBlogs.find((b) => b.id === id);
          if (existing) {
            setTitle(existing.title);
            setContent(existing.content);
            setSelectedCategory(existing.category.id);
            setTags(existing.tags);
            if (existing.coverImage) setCoverImage(existing.coverImage);
          }
        }
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title || !content || !selectedCategory) {
      alert('Title, content, and category are required.');
      return;
    }
    setIsSaving(true);
    try {
      const data = { title, content, categoryId: selectedCategory, tags, status, coverImage: coverImage || undefined };
      if (id) {
        await blogService.update(id, data);
      } else {
        await blogService.create(data);
      }
      navigate('/dashboard/blogs');
    } catch (error) {
      console.error('Failed to save', error);
      alert('Failed to save blog');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleInsertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = prefix + selectedText + suffix;
    
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    
    // Set focus back and adjust selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => handleInsertMarkdown('**', '**') },
    { icon: Italic, label: 'Italic', action: () => handleInsertMarkdown('*', '*') },
    { icon: Code, label: 'Code', action: () => handleInsertMarkdown('`', '`') },
    { icon: Heading, label: 'Heading', action: () => handleInsertMarkdown('### ', '') },
    { icon: List, label: 'List', action: () => handleInsertMarkdown('- ', '') },
    { icon: Link2, label: 'Link', action: () => handleInsertMarkdown('[', '](url)') },
    { icon: Quote, label: 'Quote', action: () => handleInsertMarkdown('> ', '') },
    { icon: Image, label: 'Image', action: () => handleInsertMarkdown('![alt text](', 'Url)') },
  ];

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-surface-100">{id ? 'Edit Post' : 'Create Post'}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Eye size={16} /> Preview</Button>
          <Button variant="secondary" size="sm" onClick={() => handleSave('draft')} isLoading={isSaving}><Save size={16} /> Save Draft</Button>
          <Button size="sm" onClick={() => handleSave('published')} isLoading={isSaving}><Send size={16} /> Publish</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cover image upload */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-300">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-surface-700 bg-surface-900/50 px-4 py-2.5 text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
            />
          </div>

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title..."
            className="w-full bg-transparent text-3xl font-heading font-bold text-surface-100 placeholder:text-surface-600 focus:outline-none border-none py-2"
            aria-label="Article title"
          />

          {/* Toolbar */}
          <div className="flex items-center gap-1 py-2 border-y border-surface-800">
            {toolbarButtons.map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={btn.action}
                className="p-2 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-white/5 transition-colors cursor-pointer"
                aria-label={btn.label}
                title={btn.label}
              >
                <btn.icon size={18} />
              </button>
            ))}
          </div>

          {/* Content editor */}
          <textarea
            id="content-editor"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your story in Markdown..."
            className={cn(
              'w-full min-h-[500px] bg-transparent text-surface-200 placeholder:text-surface-600',
              'focus:outline-none border-none resize-none text-base leading-relaxed font-mono',
            )}
            aria-label="Article content"
          />
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Category */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-heading font-semibold text-surface-200 mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
                    selectedCategory === cat.id
                      ? 'text-white shadow-lg'
                      : 'glass text-surface-400 hover:text-surface-200',
                  )}
                  style={selectedCategory === cat.id && cat.color ? { backgroundColor: cat.color } : undefined}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-heading font-semibold text-surface-200 mb-3">Tags</h3>
            <Input
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <button key={tag} type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="cursor-pointer">
                    <Badge variant="outline">
                      #{tag} ×
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-heading font-semibold text-surface-200 mb-3">SEO</h3>
            <div className="space-y-3">
              <Input label="Meta title" placeholder="SEO-friendly title" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-300">Meta description</label>
                <textarea
                  placeholder="Brief description for search engines..."
                  className="w-full rounded-xl border border-surface-700 bg-surface-900/50 px-4 py-2.5 text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none min-h-[80px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
