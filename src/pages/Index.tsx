
import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ExerciseCard from '@/components/ExerciseCard';
import AddExerciseForm from '@/components/AddExerciseForm';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
  notes: string;
}

interface CompletedWorkout {
  day: string;
  date: string;
  exercises: Exercise[];
}

const Index = () => {
  const [workoutDays] = useState(['A', 'B', 'C', 'D']);
  const [currentDay, setCurrentDay] = useState('A');
  const [exercises, setExercises] = useState<Record<string, Exercise[]>>({
    A: [],
    B: [],
    C: [],
    D: []
  });
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedExercises = localStorage.getItem('academia-tracker-exercises');
    const savedCurrentDay = localStorage.getItem('academia-tracker-current-day');
    const savedCompletedWorkouts = localStorage.getItem('academia-tracker-completed');

    if (savedExercises) {
      setExercises(JSON.parse(savedExercises));
    }
    if (savedCurrentDay) {
      setCurrentDay(savedCurrentDay);
    }
    if (savedCompletedWorkouts) {
      setCompletedWorkouts(JSON.parse(savedCompletedWorkouts));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('academia-tracker-exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('academia-tracker-current-day', currentDay);
  }, [currentDay]);

  useEffect(() => {
    localStorage.setItem('academia-tracker-completed', JSON.stringify(completedWorkouts));
  }, [completedWorkouts]);

  const addExercise = (exercise: Omit<Exercise, 'id' | 'completed'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now(),
      completed: false
    };

    setExercises(prev => ({
      ...prev,
      [currentDay]: [...prev[currentDay], newExercise]
    }));
    setShowAddDialog(false);
  };

  const updateExercise = (id: number, field: keyof Exercise, value: any) => {
    setExercises(prev => ({
      ...prev,
      [currentDay]: prev[currentDay].map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const toggleExerciseComplete = (id: number) => {
    setExercises(prev => ({
      ...prev,
      [currentDay]: prev[currentDay].map(ex => 
        ex.id === id ? { ...ex, completed: !ex.completed } : ex
      )
    }));
  };

  const deleteExercise = (id: number) => {
    setExercises(prev => ({
      ...prev,
      [currentDay]: prev[currentDay].filter(ex => ex.id !== id)
    }));
  };

  const isWorkoutComplete = () => {
    const currentExercises = exercises[currentDay] || [];
    return currentExercises.length > 0 && currentExercises.every(ex => ex.completed);
  };

  const completeWorkout = () => {
    const workout: CompletedWorkout = {
      day: currentDay,
      date: new Date().toLocaleDateString('pt-BR'),
      exercises: exercises[currentDay].map(ex => ({ ...ex }))
    };

    setCompletedWorkouts(prev => [workout, ...prev]);

    // Reset exercises for next session
    setExercises(prev => ({
      ...prev,
      [currentDay]: prev[currentDay].map(ex => ({ ...ex, completed: false }))
    }));

    // Move to next day
    const currentIndex = workoutDays.indexOf(currentDay);
    const nextIndex = (currentIndex + 1) % workoutDays.length;
    setCurrentDay(workoutDays[nextIndex]);
  };

  const getNextDay = () => {
    const currentIndex = workoutDays.indexOf(currentDay);
    const nextIndex = (currentIndex + 1) % workoutDays.length;
    return workoutDays[nextIndex];
  };

  const getCurrentExercises = () => exercises[currentDay] || [];

  return (
    <div className="max-w-md mx-auto space-y-4 bg-gray-50 min-h-screen">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold mb-2">Academia Tracker</h2>
        <p className="text-blue-100 text-lg">
          Treino {currentDay} • Próximo: {getNextDay()}
        </p>
      </div>

      {/* Day Selector */}
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
            onClick={() => setCurrentDay(day)}
          >
            Treino {day}
          </Button>
        ))}
      </div>

      {/* Exercises List */}
      <div className="space-y-3">
        {getCurrentExercises().map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdate={updateExercise}
            onToggleComplete={toggleExerciseComplete}
            onDelete={deleteExercise}
          />
        ))}

        {/* Add Exercise Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-16 border-dashed border-2 text-gray-500 hover:text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Exercício
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <AddExerciseForm
              onAdd={addExercise}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Complete Workout Button */}
      {isWorkoutComplete() && (
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          onClick={completeWorkout}
        >
          <Check className="w-5 h-5 mr-2" />
          Finalizar Treino {currentDay}
        </Button>
      )}
    </div>
  );
};

export default Index;
