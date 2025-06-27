
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
    <div className="max-w-4xl mx-auto space-y-6 bg-gray-50 min-h-screen p-4">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold mb-2">History & Progress</h1>
        <p className="text-blue-100">Track your workout history and monitor your progress over time.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <WorkoutHistory workouts={completedWorkouts.slice(0, 5)} />
      </div>
      
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <ExerciseProgress 
          completedWorkouts={completedWorkouts}
          currentExercises={exercises}
        />
      </div>
    </div>
  );
};

export default HistoryPage;
