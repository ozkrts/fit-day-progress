
import React, { useState, useEffect } from 'react';
import { Plus, Check, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExerciseCard from '@/components/ExerciseCard';
import AddExerciseForm from '@/components/AddExerciseForm';
import WorkoutHistory from '@/components/WorkoutHistory';
import ExerciseProgress from '@/components/ExerciseProgress';

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
  const [showAddForm, setShowAddForm] = useState(false);

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
    setShowAddForm(false);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold">Academia Tracker</h1>
          <p className="text-blue-100">
            Treino {currentDay} • Próximo: {getNextDay()}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <Tabs defaultValue="treino" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="treino" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Treino Hoje
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Histórico & Progresso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="treino" className="space-y-4">
            {/* Day Selector */}
            <div className="flex gap-2">
              {workoutDays.map(day => (
                <Button
                  key={day}
                  variant={currentDay === day ? "default" : "outline"}
                  className={`flex-1 ${currentDay === day ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
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

              {/* Add Exercise Button */}
              {!showAddForm && (
                <Button
                  variant="outline"
                  className="w-full h-16 border-dashed border-2 text-gray-500 hover:text-gray-700 hover:border-gray-400"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Exercício
                </Button>
              )}

              {/* Add Exercise Form */}
              {showAddForm && (
                <AddExerciseForm
                  onAdd={addExercise}
                  onCancel={() => setShowAddForm(false)}
                />
              )}
            </div>

            {/* Complete Workout Button */}
            {isWorkoutComplete() && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold"
                onClick={completeWorkout}
              >
                <Check className="w-5 h-5 mr-2" />
                Finalizar Treino {currentDay}
              </Button>
            )}
          </TabsContent>

          <TabsContent value="historico" className="space-y-6">
            <WorkoutHistory workouts={completedWorkouts.slice(0, 5)} />
            <ExerciseProgress 
              completedWorkouts={completedWorkouts}
              currentExercises={exercises}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
