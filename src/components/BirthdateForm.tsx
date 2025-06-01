
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BirthData } from './CosmicVoyager';

interface BirthdateFormProps {
  onSubmit: (data: BirthData) => void;
}

export const BirthdateForm: React.FC<BirthdateFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '12:00',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.date) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Enter Your Birth Details</h2>
        <p className="text-blue-200">Let's discover your cosmic moment</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="birthdate" className="text-white text-lg">Birth Date</Label>
          <Input
            id="birthdate"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="glass-effect border-blue-500/50 text-white placeholder-blue-300 mt-2"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="birthtime" className="text-white text-lg">Birth Time (optional)</Label>
          <Input
            id="birthtime"
            type="time"
            value={formData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            className="glass-effect border-blue-500/50 text-white placeholder-blue-300 mt-2"
          />
        </div>
        
        <div>
          <Label htmlFor="location" className="text-white text-lg">Birth Location (optional)</Label>
          <Input
            id="location"
            type="text"
            placeholder="e.g., New York, USA"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="glass-effect border-blue-500/50 text-white placeholder-blue-300 mt-2"
          />
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 glow"
        disabled={!formData.date}
      >
        Begin Cosmic Journey ✨
      </Button>
    </form>
  );
};
