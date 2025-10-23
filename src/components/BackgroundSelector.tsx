import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Video, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { 
  saveFileToPersistentStorage, 
  loadStoredFiles, 
  deleteStoredFile,
  initializeStorage 
} from '../src/fileStorage';

interface Background {
  id: string;
  type: 'video' | 'image';
  url: string;
  thumbnail: string;
  name: string;
}

interface BackgroundSelectorProps {
  textColor: string;
  accentColor: string;
  onClose: () => void;
  onSelectBackground: (bg: Background | null) => void;
  currentBackground?: Background | null;
}

export function BackgroundSelector({ 
  textColor, 
  accentColor, 
  onClose, 
  onSelectBackground,
  currentBackground 
}: BackgroundSelectorProps) {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Custom uploads - Stored persistently on device
  const [customVideos, setCustomVideos] = useState<Background[]>([]);
  const [customImages, setCustomImages] = useState<Background[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);

  // Initialize storage and load saved files on mount
  useEffect(() => {
    const loadSavedFiles = async () => {
      try {
        await initializeStorage();
        const storedFiles = await loadStoredFiles();
        
        const videos: Background[] = [];
        const images: Background[] = [];
        
        storedFiles.forEach(file => {
          const bg: Background = {
            id: file.id,
            type: file.mimeType.startsWith('video/') ? 'video' : 'image',
            url: file.uri,
            thumbnail: file.uri,
            name: file.fileName.replace(/\.[^/.]+$/, '')
          };
          
          if (bg.type === 'video') {
            videos.push(bg);
          } else {
            images.push(bg);
          }
        });
        
        setCustomVideos(videos);
        setCustomImages(images);
      } catch (error) {
        console.error('Error loading saved files:', error);
        toast.error('Errore nel caricamento degli sfondi salvati');
      } finally {
        setIsLoadingFiles(false);
      }
    };
    
    loadSavedFiles();
  }, []);

  // Pack predefiniti (usando placeholder per demo)
  const videoBackgrounds: Background[] = [
    {
      id: 'none',
      type: 'video',
      url: '',
      thumbnail: '',
      name: 'Nessuno'
    },
    {
      id: 'ocean',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
      name: 'Oceano'
    },
    {
      id: 'sunset',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-sunset-in-the-mountains-2132-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      name: 'Tramonto'
    },
    {
      id: 'stars',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400',
      name: 'Stelle'
    },
    {
      id: 'aurora',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-northern-lights-in-the-sky-4737-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400',
      name: 'Aurora'
    }
  ];

  const imageBackgrounds: Background[] = [
    {
      id: 'gradient1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400',
      name: 'Gradient 1'
    },
    {
      id: 'gradient2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1557672199-6f0297deecfc?w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1557672199-6f0297deecfc?w=400',
      name: 'Gradient 2'
    },
    {
      id: 'nature',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      name: 'Montagne'
    },
    {
      id: 'space',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400',
      name: 'Spazio'
    }
  ];

  // Handle video upload
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Per favore seleziona un file video');
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Il video è troppo grande. Max 100MB');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Salvataggio video...');

    try {
      const id = `custom-video-${Date.now()}`;
      
      // Save to persistent storage
      const storedFile = await saveFileToPersistentStorage(file, id);
      
      const newVideo: Background = {
        id: storedFile.id,
        type: 'video',
        url: storedFile.uri,
        thumbnail: storedFile.uri,
        name: file.name.replace(/\.[^/.]+$/, '')
      };
      
      setCustomVideos(prev => [...prev, newVideo]);
      toast.success('Video salvato!', { id: loadingToast });
      onSelectBackground(newVideo);
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Errore nel salvataggio', { id: loadingToast });
    }
    
    event.target.value = ''; // Reset input
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Per favore seleziona un\'immagine');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('L\'immagine è troppo grande. Max 10MB');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Salvataggio immagine...');

    try {
      const id = `custom-image-${Date.now()}`;
      
      // Save to persistent storage
      const storedFile = await saveFileToPersistentStorage(file, id);
      
      const newImage: Background = {
        id: storedFile.id,
        type: 'image',
        url: storedFile.uri,
        thumbnail: storedFile.uri,
        name: file.name.replace(/\.[^/.]+$/, '')
      };
      
      setCustomImages(prev => [...prev, newImage]);
      toast.success('Immagine salvata!', { id: loadingToast });
      onSelectBackground(newImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Errore nel salvataggio', { id: loadingToast });
    }
    
    event.target.value = ''; // Reset input
  };

  // Delete custom background
  const deleteCustomBackground = async (bg: Background, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const loadingToast = toast.loading('Rimozione...');
    
    try {
      // Delete from persistent storage
      await deleteStoredFile(bg.name + '.' + getFileExtension(bg.url));
      
      if (bg.type === 'video') {
        setCustomVideos(prev => prev.filter(v => v.id !== bg.id));
      } else {
        setCustomImages(prev => prev.filter(i => i.id !== bg.id));
      }
      
      if (currentBackground?.id === bg.id) {
        onSelectBackground(null);
      }
      
      toast.success('Sfondo rimosso', { id: loadingToast });
    } catch (error) {
      console.error('Error deleting background:', error);
      toast.error('Errore nella rimozione', { id: loadingToast });
    }
  };
  
  // Helper to get file extension from URL
  const getFileExtension = (url: string): string => {
    // For Capacitor URIs
    if (url.includes('backgrounds/')) {
      const match = url.match(/backgrounds\/[^/]+\.([^.?]+)/);
      return match ? match[1] : 'jpg';
    }
    // Fallback
    return 'jpg';
  };

  const BackgroundCard = ({ bg, isCustom = false }: { bg: Background; isCustom?: boolean }) => {
    const isSelected = currentBackground?.id === bg.id;
    
    if (bg.id === 'none') {
      return (
        <button
          onClick={() => onSelectBackground(null)}
          className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden transition-all"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: `2px solid ${isSelected ? accentColor : 'rgba(255, 255, 255, 0.1)'}`,
            boxShadow: isSelected ? `0 0 20px ${accentColor}40` : 'none'
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <ImageIcon size={24} className="sm:w-8 sm:h-8 mb-1 sm:mb-2" style={{ color: textColor, opacity: 0.3 }} />
            <span className="text-xs sm:text-sm" style={{ color: textColor, opacity: 0.5 }}>Nessuno</span>
          </div>
        </button>
      );
    }

    return (
      <button
        onClick={() => onSelectBackground(bg)}
        className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden transition-all group"
        style={{
          border: `2px solid ${isSelected ? accentColor : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: isSelected ? `0 0 20px ${accentColor}40` : 'none'
        }}
      >
        {bg.type === 'video' ? (
          <video 
            src={bg.url} 
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <img 
            src={bg.thumbnail} 
            alt={bg.name}
            className="w-full h-full object-cover"
          />
        )}
        
        {bg.type === 'video' && !isCustom && (
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 rounded-lg bg-black/60">
            <Video size={14} className="sm:w-4 sm:h-4" style={{ color: textColor }} />
          </div>
        )}
        
        {isCustom && (
          <button
            onClick={(e) => deleteCustomBackground(bg, e)}
            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 rounded-lg bg-red-500/90 hover:bg-red-500 transition-colors z-10"
            title="Rimuovi"
          >
            <X size={14} className="sm:w-4 sm:h-4 text-white" />
          </button>
        )}
        
        <div 
          className="absolute bottom-0 left-0 right-0 p-2 sm:p-3"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
          }}
        >
          <span className="text-xs sm:text-sm" style={{ color: textColor }}>{bg.name}</span>
        </div>
        
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center"
            style={{ background: accentColor }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="sm:w-4 sm:h-4">
              <path d="M13 4L6 11L3 8" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        )}
      </button>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ 
        background: '#000000'
      }}
    >
      <div className="pt-safe px-5 sm:px-8 pb-4 sm:pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <ImageIcon size={24} className="sm:w-7 sm:h-7" style={{ color: accentColor }} />
            <h1 className="text-2xl sm:text-3xl" style={{ color: textColor }}>Sfondi</h1>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-base sm:text-lg -mr-2"
            style={{ color: accentColor }}
          >
            Fine
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 sm:px-8 pb-safe landscape:px-10 landscape:py-6">
        <div className="landscape:max-w-6xl landscape:mx-auto">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="w-full mb-4 sm:mb-6 landscape:mb-4">
              <TabsTrigger value="videos" className="flex-1 text-sm sm:text-base">Video</TabsTrigger>
              <TabsTrigger value="images" className="flex-1 text-sm sm:text-base">Immagini</TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="space-y-3 sm:space-y-4">
              {/* Upload button */}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <button
                onClick={() => videoInputRef.current?.click()}
                className="w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-dashed transition-all hover:scale-[1.02]"
                style={{
                  borderColor: accentColor + '40',
                  background: accentColor + '10'
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className="sm:w-8 sm:h-8" style={{ color: accentColor }} />
                  <span className="text-sm sm:text-base" style={{ color: textColor }}>
                    Carica il tuo video
                  </span>
                  <span className="text-xs opacity-50" style={{ color: textColor }}>
                    Max 100MB • MP4, MOV, WebM
                  </span>
                  <span className="text-[10px] opacity-40" style={{ color: textColor }}>
                    ✓ Salvati permanentemente sul tuo dispositivo
                  </span>
                </div>
              </button>

              {/* Custom videos */}
              {customVideos.length > 0 && (
                <>
                  <h3 className="text-xs sm:text-sm uppercase tracking-wider opacity-50 px-2" style={{ color: textColor }}>
                    I tuoi video
                  </h3>
                  <div className="grid grid-cols-2 landscape:grid-cols-3 gap-3 sm:gap-4">
                    {customVideos.map(bg => (
                      <BackgroundCard key={bg.id} bg={bg} isCustom />
                    ))}
                  </div>
                </>
              )}

              {/* Predefined videos */}
              <h3 className="text-xs sm:text-sm uppercase tracking-wider opacity-50 px-2" style={{ color: textColor }}>
                Predefiniti
              </h3>
              <div className="grid grid-cols-2 landscape:grid-cols-3 gap-3 sm:gap-4">
                {videoBackgrounds.map(bg => (
                  <BackgroundCard key={bg.id} bg={bg} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-3 sm:space-y-4">
              {/* Upload button */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => imageInputRef.current?.click()}
                className="w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-dashed transition-all hover:scale-[1.02]"
                style={{
                  borderColor: accentColor + '40',
                  background: accentColor + '10'
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className="sm:w-8 sm:h-8" style={{ color: accentColor }} />
                  <span className="text-sm sm:text-base" style={{ color: textColor }}>
                    Carica la tua immagine
                  </span>
                  <span className="text-xs opacity-50" style={{ color: textColor }}>
                    Max 10MB • JPG, PNG, WebP
                  </span>
                </div>
              </button>

              {/* Custom images */}
              {customImages.length > 0 && (
                <>
                  <h3 className="text-xs sm:text-sm uppercase tracking-wider opacity-50 px-2" style={{ color: textColor }}>
                    Le tue immagini
                  </h3>
                  <div className="grid grid-cols-2 landscape:grid-cols-3 gap-3 sm:gap-4">
                    {customImages.map(bg => (
                      <BackgroundCard key={bg.id} bg={bg} isCustom />
                    ))}
                  </div>
                </>
              )}

              {/* Predefined images */}
              <h3 className="text-xs sm:text-sm uppercase tracking-wider opacity-50 px-2" style={{ color: textColor }}>
                Predefiniti
              </h3>
              <div className="grid grid-cols-2 landscape:grid-cols-3 gap-3 sm:gap-4">
                {imageBackgrounds.map(bg => (
                  <BackgroundCard key={bg.id} bg={bg} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
