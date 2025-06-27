
import React, { useState, useEffect } from 'react';
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

const HistoryPage = () => {
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [exercises, setExercises] = useState<Record<string, Exercise[]>>({
    A: [],
    B: [],
    C: [],
    D: []
  });

  // Load data from localStorage
  useEffect(() => {
    const savedExercises = localStorage.getItem('academia-tracker-exercises');
    const savedCompletedWorkouts = localStorage.getItem('academia-tracker-completed');

    if (savedExercises) {
      setExercises(JSON.parse(savedExercises));
    }
    if (savedCompletedWorkouts) {
      setCompletedWorkouts(JSON.parse(savedCompletedWorkouts));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">History & Progress</h1>
        <p className="text-gray-600">Track your workout history and monitor your progress over time.</p>
      </div>
      
      <WorkoutHistory workouts={completedWorkouts.slice(0, 5)} />
      <ExerciseProgress 
        completedWorkouts={completedWorkouts}
        currentExercises={exercises}
      />
    </div>
  );
};

export default HistoryPage;
