import { useState, useEffect } from 'react';

interface PreLoaderProps {
  onComplete: () => void;
}

const PreLoader = ({ onComplete }: PreLoaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center z-50">
      <div className="text-center">
        {/* 3D Cinema Reel Animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Main reel */}
            <div className="w-full h-full border-8 border-primary rounded-full animate-spin" 
                 style={{ animationDuration: '3s' }}>
              {/* Inner circles */}
              <div className="absolute inset-4 border-4 border-primary/60 rounded-full">
                <div className="absolute inset-2 border-2 border-primary/40 rounded-full">
                  <div className="absolute inset-2 bg-primary/20 rounded-full"></div>
                </div>
              </div>
              
              {/* Film strips */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-6 bg-primary"
                  style={{
                    top: '10px',
                    left: '50%',
                    transformOrigin: '50% 54px',
                    transform: `translateX(-50%) rotate(${i * 45}deg)`
                  }}
                />
              ))}
            </div>
            
            {/* Glowing effect */}
            <div className="absolute inset-0 w-full h-full border-8 border-primary/30 rounded-full animate-pulse"></div>
          </div>

          {/* Film strip decoration */}
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-16 bg-gradient-to-b from-primary/60 to-primary/20 rounded-sm animate-pulse" 
                 style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-16 bg-gradient-to-b from-primary/60 to-primary/20 rounded-sm animate-pulse" 
                 style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Logo */}
        <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4 animate-fade-in">
          Yoruba Cinemax
        </h1>
        <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Nigeria's Premier Yoruba Movie Destination
        </p>

        {/* Progress Bar */}
        <div className="w-80 max-w-full mx-auto mb-4">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreLoader;