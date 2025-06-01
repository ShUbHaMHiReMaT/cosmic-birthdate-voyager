
import React, { useState, useEffect } from 'react';
import { BirthdateForm } from './BirthdateForm';
import { SolarSystemViewer } from './SolarSystemViewer';
import { ApodDisplay } from './ApodDisplay';
import { StarField } from './StarField';
import { Card } from '@/components/ui/card';

export interface BirthData {
  date: string;
  time: string;
  location: string;
}

const CosmicVoyager = () => {
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [isExploring, setIsExploring] = useState(false);

  const handleBirthDataSubmit = (data: BirthData) => {
    setBirthData(data);
    setIsExploring(true);
  };

  const resetJourney = () => {
    setBirthData(null);
    setIsExploring(false);
  };

  return (
    <div className="min-h-screen cosmic-bg relative overflow-hidden">
      <StarField />
      
      {!isExploring ? (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="floating mb-8">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Cosmic Birthdate Voyager
              </h1>
              <p className="text-xl md:text-2xl text-blue-200 mb-8">
                Journey back to the moment you were born and discover how the universe looked on your special day
              </p>
            </div>
            
            <Card className="glass-effect border-blue-500/30 p-8 max-w-2xl mx-auto">
              <BirthdateForm onSubmit={handleBirthDataSubmit} />
            </Card>
          </div>
        </div>
      ) : (
        <div className="relative z-10 h-screen">
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={resetJourney}
              className="glass-effect text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/30"
            >
              ← New Journey
            </button>
          </div>
          
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <div className="lg:col-span-2 relative">
              <SolarSystemViewer birthData={birthData!} />
            </div>
            
            <div className="space-y-4 overflow-y-auto">
              <ApodDisplay date={birthData!.date} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CosmicVoyager;
