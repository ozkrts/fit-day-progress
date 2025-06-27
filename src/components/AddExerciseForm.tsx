
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes: string;
}

interface AddExerciseFormProps {
  onAdd: (exercise: Exercise) => void;
  onCancel: () => void;
}

const AddExerciseForm: React.FC<AddExerciseFormProps> = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState<Exercise>({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onAdd(formData);
      setFormData({
        name: '',
        sets: 3,
        reps: 10,
        weight: 0,
        notes: ''
      });
    }
  };

  const handleChange = (field: keyof Exercise, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Novo Exercício</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nome do Exercício *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Supino reto, Agachamento..."
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Séries *
              </label>
              <Input
                type="number"
                value={formData.sets}
                onChange={(e) => handleChange('sets', Number(e.target.value))}
                className="text-center"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Reps *
              </label>
              <Input
                type="number"
                value={formData.reps}
                onChange={(e) => handleChange('reps', Number(e.target.value))}
                className="text-center"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Peso (kg) *
              </label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange('weight', Number(e.target.value))}
                className="text-center"
                min="0"
                step="0.5"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Observações
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Anotações sobre o exercício..."
              className="resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!formData.name.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddExerciseForm;
