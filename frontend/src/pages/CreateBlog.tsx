import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, Save, Send, Eye, Bold, Italic, Code, List, Heading, Link2, Quote, Loader2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { blogService } from '@/services/blogService';
import { categoryService } from '@/services/categoryService';
import { storageService } from '@/services/storageService';
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
  const [isPreview, setIsPreview] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

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

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    setIsUploadingImage(true);
    try {
      const url = await storageService.uploadCoverImage(file);
      setCoverImage(url);
    } catch (error) {
      console.error('Failed to upload image', error);
      alert('Failed to upload image. Make sure your Firebase Storage rules are configured properly.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleImageUpload(e.target.files[0]);
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

  // Simple markdown-to-html rendering for preview
  const renderContent = (markdown: string) => {
    const lines = markdown.trim().split('\n');
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
      if (line.startsWith('- **') || line.startsWith('1. **') || line.startsWith('- ')) {
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
          <Button variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? <><Code size={16} /> Editor</> : <><Eye size={16} /> Preview</>}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleSave('draft')} isLoading={isSaving}><Save size={16} /> Save Draft</Button>
          <Button size="sm" onClick={() => handleSave('published')} isLoading={isSaving}><Send size={16} /> Publish</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cover image upload */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-surface-300">Cover Image</label>
              {coverImage && (
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove Image
                </button>
              )}
            </div>
            
            {coverImage ? (
              <div className="relative w-full h-64 rounded-2xl overflow-hidden group">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-surface-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <label className="cursor-pointer px-4 py-2 bg-surface-800 text-surface-200 hover:bg-surface-700 hover:text-white rounded-xl transition-colors font-medium text-sm border border-surface-700 shadow-sm">
                    <span>Change Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={onFileSelect} />
                  </label>
                </div>
              </div>
            ) : (
              <label
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200",
                  isDragActive 
                    ? "border-primary-500 bg-primary-500/10" 
                    : "border-surface-700 bg-surface-900/50 hover:bg-surface-800/50 hover:border-surface-600"
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-10 h-10 mb-3 text-primary-500 animate-spin" />
                      <p className="mb-2 text-sm text-surface-400">Uploading image...</p>
                    </>
                  ) : (
                    <>
                      <div className="p-4 rounded-full bg-surface-800/50 mb-4">
                        <UploadCloud className="w-8 h-8 text-surface-400" />
                      </div>
                      <p className="mb-2 text-sm text-surface-300">
                        <span className="font-semibold text-primary-400">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-surface-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={onFileSelect}
                  disabled={isUploadingImage}
                />
              </label>
            )}
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
          {!isPreview && (
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
          )}

          {/* Content editor */}
          {isPreview ? (
            <div className="w-full min-h-[500px] text-surface-200">
              {content ? renderContent(content) : <p className="text-surface-600 italic">No content to preview.</p>}
            </div>
          ) : (
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
          )}
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
