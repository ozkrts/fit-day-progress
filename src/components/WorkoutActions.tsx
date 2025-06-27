
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkoutActionsProps {
  isWorkoutComplete: boolean;
  currentDay: string;
  onCompleteWorkout: () => void;
}

const WorkoutActions: React.FC<WorkoutActionsProps> = ({ 
  isWorkoutComplete, 
  currentDay, 
  onCompleteWorkout 
}) => {
  if (!isWorkoutComplete) return null;

  return (
    <Button
      className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
      onClick={onCompleteWorkout}
    >
      <Check className="w-5 h-5 mr-2" />
      Finalizar Treino {currentDay}
    </Button>
  );
};

export default WorkoutActions;
