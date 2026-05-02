import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const mockImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
  'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'
];

export function ImagePreviewPage() {
  const { index = '0' } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(parseInt(index));
  const [scale, setScale] = useState(1);
  const [showControls, setShowControls] = useState(true);

  const images = mockImages;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate(-1);
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setScale(1);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setScale(1);
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.5, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.5, 0.5));

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 text-white">
        <span className="text-sm">{currentIndex + 1} / {images.length}</span>
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        onClick={() => setShowControls(!showControls)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            style={{ scale, maxHeight: '80vh', maxWidth: '100%' }}
            className="object-contain"
            alt=""
          />
        </AnimatePresence>
      </div>

      {showControls && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full text-white hover:bg-white/30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full text-white hover:bg-white/30"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-center gap-6 p-6 text-white">
            <button onClick={zoomOut} className="p-3 hover:bg-white/20 rounded-full">
              <ZoomOut className="w-5 h-5" />
            </button>
            <button onClick={zoomIn} className="p-3 hover:bg-white/20 rounded-full">
              <ZoomIn className="w-5 h-5" />
            </button>
            <button className="p-3 hover:bg-white/20 rounded-full">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-3 hover:bg-white/20 rounded-full">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
