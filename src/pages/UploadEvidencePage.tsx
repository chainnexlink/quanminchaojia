import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Image, Video, X, CheckCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { useStore } from '../store';

export function UploadEvidencePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();
  const [content, setContent] = useState('');
  const [selectedCamp, setSelectedCamp] = useState<'north' | 'south'>((user?.camp as 'north' | 'south') || 'north');
  const [files, setFiles] = useState<{type: 'image' | 'video', preview: string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFiles(prev => [...prev, { type, preview: event.target?.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!content.trim() && files.length === 0) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      setTimeout(() => navigate(-1), 1500);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100">上传成功!</h2>
          <p className="text-slate-400 mt-2">+{files.some(f => f.type === 'video') ? 5 : 3} 战力</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <span className="font-semibold text-slate-100">上传佐证</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={uploading || (!content.trim() && files.length === 0)}
          className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {uploading ? '上传中...' : '发布'}
        </motion.button>
      </div>

      <div className="p-4">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-4">
          <span className="text-sm text-slate-400 mb-2 block">选择阵营</span>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedCamp('north')}
              className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                selectedCamp === 'north' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}
            >
              <span className="text-lg">❄️</span> 北方
            </button>
            <button
              onClick={() => setSelectedCamp('south')}
              className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                selectedCamp === 'south' ? 'bg-pink-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}
            >
              <span className="text-lg">☀️</span> 南方
            </button>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-4">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="描述你的佐证内容..."
            rows={5}
            className="w-full text-sm outline-none resize-none bg-transparent text-slate-200 placeholder-slate-500"
          />
        </div>

        {files.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
            {files.map((file, index) => (
              <div key={index} className="relative">
                {file.type === 'image' ? (
                  <img src={file.preview} className="w-24 h-24 object-cover rounded-lg" alt="" />
                ) : (
                  <video src={file.preview} className="w-24 h-24 object-cover rounded-lg" />
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e, 'image')}
          />
          <input
            type="file"
            ref={videoInputRef}
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, 'video')}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl flex items-center justify-center gap-2 text-slate-300 hover:border-slate-600"
          >
            <Image className="w-5 h-5" /> 图片
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => videoInputRef.current?.click()}
            className="flex-1 py-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl flex items-center justify-center gap-2 text-slate-300 hover:border-slate-600"
          >
            <Video className="w-5 h-5" /> 视频
          </motion.button>
        </div>

        <div className="mt-4 p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
          <p className="text-xs text-violet-400">💡 上传图片 +3战力，上传视频 +5战力</p>
        </div>
      </div>
    </div>
  );
}
