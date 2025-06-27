
import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
  notes: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdate: (id: number, field: keyof Exercise, value: any) => void;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onUpdate,
  onToggleComplete,
  onDelete
}) => {
  return (
    <Card className={`transition-all duration-200 ${
      exercise.completed 
        ? 'border-green-500 bg-green-50' 
        : 'border-gray-200 bg-white hover:shadow-md'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <Checkbox
              checked={exercise.completed}
              onCheckedChange={() => onToggleComplete(exercise.id)}
              className="mt-1"
            />
            <h3 className={`font-semibold text-lg ${
              exercise.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {exercise.name}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(exercise.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Séries
            </label>
            <Input
              type="number"
              value={exercise.sets}
              onChange={(e) => onUpdate(exercise.id, 'sets', Number(e.target.value))}
              disabled={exercise.completed}
              className="text-center"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Reps
            </label>
            <Input
              type="number"
              value={exercise.reps}
              onChange={(e) => onUpdate(exercise.id, 'reps', Number(e.target.value))}
              disabled={exercise.completed}
              className="text-center"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Peso (kg)
            </label>
            <Input
              type="number"
              value={exercise.weight}
              onChange={(e) => onUpdate(exercise.id, 'weight', Number(e.target.value))}
              disabled={exercise.completed}
              className="text-center"
              min="0"
              step="0.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Observações
          </label>
          <Textarea
            value={exercise.notes}
            onChange={(e) => onUpdate(exercise.id, 'notes', e.target.value)}
            disabled={exercise.completed}
            placeholder="Anotações sobre o exercício..."
            className="resize-none"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
