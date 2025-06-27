
import React from 'react';
import { Calendar, Dumbbell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface WorkoutHistoryProps {
  workouts: CompletedWorkout[];
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ workouts }) => {
  if (workouts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Treinos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum treino finalizado ainda.</p>
            <p className="text-sm">Complete seu primeiro treino para ver o histórico!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Treinos Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {workouts.map((workout, index) => (
          <div key={`${workout.day}-${workout.date}-${index}`} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Treino {workout.day}</h3>
              <span className="text-sm text-gray-500">{workout.date}</span>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {workout.exercises.length} exercício{workout.exercises.length !== 1 ? 's' : ''}
            </div>
            <div className="space-y-2">
              {workout.exercises.map((exercise, exIndex) => (
                <div key={`${exercise.id}-${exIndex}`} className="text-sm bg-gray-50 rounded p-2">
                  <span className="font-medium">{exercise.name}</span>
                  <span className="text-gray-600 ml-2">
                    • {exercise.sets}x{exercise.reps} • {exercise.weight}kg
                  </span>
                  {exercise.notes && (
                    <div className="text-xs text-gray-500 mt-1">
                      "{exercise.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WorkoutHistory;
