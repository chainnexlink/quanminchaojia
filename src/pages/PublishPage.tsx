import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Video, AlertCircle, CheckCircle, Clock, MapPin, X } from 'lucide-react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { checkContent } from '../services/contentModeration';

export function PublishPage() {
  const navigate = useNavigate();
  const { user, createTopic, addPoints } = useStore();
  const { showToast } = useToast();
  const [mode, setMode] = useState<'culture' | 'local'>('culture');
  const [title, setTitle] = useState('');
  const [camps, setCamps] = useState<string[]>(['', '']);
  const [expireAt, setExpireAt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleCampChange = (index: number, value: string) => {
    const newCamps = [...camps];
    newCamps[index] = value;
    setCamps(newCamps);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addCamp = () => {
    if (camps.length < (mode === 'culture' ? 3 : 32)) {
      setCamps([...camps, '']);
    }
  };

  const removeCamp = (index: number) => {
    if (camps.length > 2) {
      setCamps(camps.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (title.length < 10 || camps.some(c => c.length < 2)) return;
    if (mode === 'local' && !expireAt) return;

    // 内容审核 - 敏感词检测
    const titleCheck = checkContent(title);
    const campsCheck = checkContent(camps.join(' '));
    if (!titleCheck.passed || !campsCheck.passed) {
      showToast('内容包含违规词汇，请修改后重试', 'error');
      return;
    }

    if (mode === 'local') {
      const userPoints = user?.points ?? 0;
      if (userPoints < 100) {
        showToast('辩豆不足100，无法发布同城辩论', 'error');
        return;
      }
      addPoints(-100);
    }

    try {
      await createTopic({
        title,
        debate_type: mode,
        camps: camps.filter(c => c.trim()),
        expire_at: mode === 'local' ? expireAt : undefined
      });
      showToast('话题发布成功！', 'success');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/home');
      }, 1500);
    } catch (err) {
      if (mode === 'local') addPoints(100);
      showToast('发布失败，请稍后重试', 'error');
    }
  };

  const isValid = title.length >= 10 &&
    camps.filter(c => c.trim().length >= 2).length >= 2 &&
    (mode === 'culture' || expireAt);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">发布话题</h1>
      </div>

      <div className="p-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode('culture'); setCamps(['', '']); }}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              mode === 'culture'
                ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'
                : 'bg-slate-800 text-slate-400 border border-slate-700/50'
            }`}
          >
            文化差异
          </button>
          <button
            onClick={() => { setMode('local'); setCamps(['', '']); }}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              mode === 'local'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-800 text-slate-400 border border-slate-700/50'
            }`}
          >
            同城辩论
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">
              话题标题 <span className="text-slate-500">({title.length}/50)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 50))}
              placeholder={mode === 'culture' ? "例如：豆腐脑吃咸还是甜？" : "例如：哪家烤肉店更好吃？"}
              className="w-full px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-800/50 text-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all placeholder-slate-500"
            />
          </div>

          {mode === 'local' && (
            <div>
              <label className="text-sm font-medium text-slate-400 mb-2 block flex items-center gap-1">
                <Clock className="w-4 h-4" /> 截止时间
              </label>
              <input
                type="datetime-local"
                value={expireAt}
                onChange={(e) => setExpireAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-800/50 text-slate-200 focus:border-violet-500 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">1小时 ~ 30天</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">
              {mode === 'culture' ? '阵营观点' : '选项'}
              <span className="text-slate-500"> ({camps.filter(c => c.trim()).length}/{mode === 'culture' ? 3 : 32})</span>
            </label>
            <div className="space-y-2">
              {camps.map((camp, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={camp}
                    onChange={(e) => handleCampChange(i, e.target.value)}
                    placeholder={mode === 'culture' ? `阵营${i + 1}观点` : `选项${i + 1}`}
                    className={`flex-1 px-4 py-3 rounded-xl border outline-none transition-all bg-slate-800/50 text-slate-200 placeholder-slate-500 ${
                      i === 0 ? 'border-cyan-500/30 focus:border-cyan-500' :
                      i === 1 ? 'border-pink-500/30 focus:border-pink-500' :
                      'border-slate-700/50 focus:border-violet-500'
                    }`}
                  />
                  {camps.length > 2 && (
                    <button onClick={() => removeCamp(i)} className="px-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {camps.length < (mode === 'culture' ? 3 : 32) && (
              <button onClick={addCamp} className="mt-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                + 添加{mode === 'culture' ? '阵营' : '选项'}
              </button>
            )}
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl">
            <label className="text-sm font-medium text-slate-400 mb-3 block">添加佐证（可选）</label>
            {images.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-2">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      <X size={12} />
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
                onChange={handleFileSelect}
              />
              <input
                type="file"
                ref={videoInputRef}
                accept="video/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600/50 text-slate-300 hover:border-violet-500/50 hover:text-violet-400 transition-all"
              >
                <Camera size={18} /> 图片
              </button>
              <button
                onClick={() => videoInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600/50 text-slate-300 hover:border-violet-500/50 hover:text-violet-400 transition-all"
              >
                <Video size={18} /> 视频
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <AlertCircle size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-300">
              {mode === 'local' ? '同城辩论需消耗100辩豆发布' : '内容将通过AI审核，禁止地域黑、辱骂、违规内容'}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
          >
            发布{mode === 'local' ? ' (100辩豆)' : ''}
          </motion.button>
        </motion.div>
      </div>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
        >
          <div className="bg-slate-800 border border-slate-700/50 p-8 rounded-2xl flex flex-col items-center">
            <CheckCircle size={48} className="text-green-400 mb-4" />
            <p className="text-lg font-bold text-slate-100">发布成功！</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
