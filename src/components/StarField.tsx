
import React, { useEffect, useRef } from 'react';

export const StarField = () => {
  const starFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createStars = () => {
      if (!starFieldRef.current) return;
      
      const starField = starFieldRef.current;
      const numberOfStars = 150;
      
      // Clear existing stars
      starField.innerHTML = '';
      
      for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;
        
        starField.appendChild(star);
      }
    };

    createStars();
    
    const handleResize = () => {
      createStars();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={starFieldRef} className="star-field" />;
};
