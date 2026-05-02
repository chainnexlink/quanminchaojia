import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Image, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';

export function PostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { topics } = useStore();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const mockPosts: Record<string, { content: string; images: string[] }> = {
    default: { content: '这是一篇帖子内容，可以编辑修改。', images: [] }
  };
  const post = mockPosts[id || ''] || mockPosts['default'];

  const [content, setContent] = useState(post.content);
  const [images, setImages] = useState<string[]>(post.images);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('保存成功', 'success');
      navigate(-1);
    }, 800);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <span className="font-semibold text-slate-100">编辑帖子</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving || !content.trim()}
          className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg text-sm font-medium flex items-center gap-1 disabled:opacity-50"
        >
          {saving ? '保存中...' : <><Save className="w-4 h-4" /> 保存</>}
        </motion.button>
      </div>

      <div className="p-4">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="编辑你的内容..."
          rows={8}
          className="w-full p-4 bg-slate-800/80 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none resize-none focus:border-violet-500"
        />

        {images.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-2">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} alt="" className="w-24 h-24 object-cover rounded-lg" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => showToast('请从相册选择图片', 'info')} className="mt-4 w-full py-3 bg-slate-800/80 border border-slate-700/50 rounded-xl text-sm text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-700/50">
          <Image className="w-4 h-4" /> 添加图片
        </button>
      </div>
    </div>
  );
}
