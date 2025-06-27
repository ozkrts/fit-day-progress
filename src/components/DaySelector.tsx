
import React from 'react';
import { Button } from '@/components/ui/button';

interface DaySelectorProps {
  workoutDays: string[];
  currentDay: string;
  onDayChange: (day: string) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ workoutDays, currentDay, onDayChange }) => {
  return (
    <div className="flex gap-2">
      {workoutDays.map(day => (
        <Button
          key={day}
          variant={currentDay === day ? "default" : "outline"}
          className={`flex-1 transition-colors ${
            currentDay === day 
              ? 'bg-blue-600 hover:bg-blue-700 shadow-md' 
              : 'hover:bg-blue-50 hover:border-blue-300'
          }`}
          onClick={() => onDayChange(day)}
        >
          Treino {day}
        </Button>
      ))}
    </div>
  );
};

export default DaySelector;
