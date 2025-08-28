import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="loading-container opacity-0 transition-opacity duration-500">
        <div className="loading-text">Yoruba Cinemax</div>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className="relative">
        <div className="loading-text animate-shine animate-float">
          Yoruba Cinemax
        </div>
        <div className="absolute inset-0 animate-glow bg-gradient-to-r from-primary via-secondary to-primary opacity-20 blur-xl"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;