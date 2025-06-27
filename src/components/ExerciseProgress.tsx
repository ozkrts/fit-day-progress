
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface ExerciseProgressProps {
  completedWorkouts: CompletedWorkout[];
  currentExercises: Record<string, Exercise[]>;
}

const ExerciseProgress: React.FC<ExerciseProgressProps> = ({ completedWorkouts, currentExercises }) => {
  // Get all unique exercise names and their progress
  const getExerciseProgress = () => {
    const exerciseMap: Record<string, Array<{
      date: string;
      sets: number;
      reps: number;
      weight: number;
      day: string;
    }>> = {};

    // Process completed workouts
    completedWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (!exerciseMap[exercise.name]) {
          exerciseMap[exercise.name] = [];
        }
        exerciseMap[exercise.name].push({
          date: workout.date,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          day: workout.day
        });
      });
    });

    // Filter exercises that appear at least twice
    const progressExercises = Object.entries(exerciseMap)
      .filter(([_, history]) => history.length >= 2)
      .map(([name, history]) => {
        // Sort by date (most recent first)
        const sortedHistory = history.sort((a, b) => {
          const dateA = new Date(a.date.split('/').reverse().join('-'));
          const dateB = new Date(b.date.split('/').reverse().join('-'));
          return dateB.getTime() - dateA.getTime();
        });

        const latest = sortedHistory[0];
        const previous = sortedHistory[1];
        const weightDiff = latest.weight - previous.weight;

        return {
          name,
          history: sortedHistory.slice(0, 3), // Last 3 executions
          weightDiff,
          trend: weightDiff > 0 ? 'up' : weightDiff < 0 ? 'down' : 'stable'
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return progressExercises;
  };

  const progressData = getExerciseProgress();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'down':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatWeightDiff = (diff: number) => {
    if (diff === 0) return '±0kg';
    return diff > 0 ? `+${diff}kg` : `${diff}kg`;
  };

  if (progressData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Progressão de Exercícios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Análise de progresso indisponível.</p>
            <p className="text-sm">Complete o mesmo exercício pelo menos 2 vezes para ver a progressão!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Progressão de Exercícios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {progressData.map((exercise, index) => (
          <div key={`${exercise.name}-${index}`} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{exercise.name}</h3>
              <Badge 
                variant="outline" 
                className={`${getTrendColor(exercise.trend)} flex items-center gap-1`}
              >
                {getTrendIcon(exercise.trend)}
                {formatWeightDiff(exercise.weightDiff)}
              </Badge>
            </div>
            <div className="space-y-2">
              {exercise.history.map((session, sessionIndex) => (
                <div key={`${session.date}-${sessionIndex}`} className="flex items-center justify-between text-sm bg-gray-50 rounded p-2">
                  <div>
                    <span className="font-medium">Treino {session.day}</span>
                    <span className="text-gray-600 ml-2">{session.date}</span>
                  </div>
                  <div className="text-gray-700">
                    {session.sets}x{session.reps} • {session.weight}kg
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ExerciseProgress;
