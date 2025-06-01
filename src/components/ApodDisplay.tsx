
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

interface ApodData {
  title: string;
  explanation: string;
  url: string;
  media_type: string;
  date: string;
}

interface ApodDisplayProps {
  date: string;
}

const fetchApod = async (date: string): Promise<ApodData> => {
  // Note: In a real app, you'd need to handle CORS or use a backend proxy
  // For demo purposes, we'll simulate the API call
  console.log(`Fetching APOD for date: ${date}`);
  
  // Simulated APOD data
  return {
    title: "Cosmic Wonder of Your Birth",
    explanation: `On ${date}, the universe was showcasing incredible cosmic phenomena. The night sky was filled with countless stars, nebulae, and distant galaxies, each telling a story that began billions of years ago. Your birth coincided with this magnificent celestial display, making you a part of the cosmic tapestry that spans the entire observable universe.`,
    url: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&q=80",
    media_type: "image",
    date: date
  };
};

export const ApodDisplay: React.FC<ApodDisplayProps> = ({ date }) => {
  const { data: apod, isLoading, error } = useQuery({
    queryKey: ['apod', date],
    queryFn: () => fetchApod(date),
  });

  if (isLoading) {
    return (
      <Card className="glass-effect border-blue-500/30">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-48 bg-blue-500/20 rounded-lg mb-4"></div>
            <div className="h-4 bg-blue-500/20 rounded mb-2"></div>
            <div className="h-4 bg-blue-500/20 rounded mb-2"></div>
            <div className="h-20 bg-blue-500/20 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !apod) {
    return (
      <Card className="glass-effect border-blue-500/30">
        <CardContent className="p-6">
          <p className="text-white text-center">Unable to load cosmic image for this date</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-white text-lg">Astronomy Picture of Your Day</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          {apod.media_type === 'image' && (
            <img
              src={apod.url}
              alt={apod.title}
              className="w-full h-48 object-cover rounded-lg border border-blue-500/30"
            />
          )}
          
          <div>
            <h3 className="text-white font-semibold mb-2">{apod.title}</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              {apod.explanation}
            </p>
          </div>
          
          <div className="pt-2 border-t border-blue-500/30">
            <p className="text-blue-300 text-xs">
              Date: {apod.date}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
