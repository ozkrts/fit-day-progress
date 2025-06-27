
import React from 'react';

interface WorkoutHeaderProps {
  currentDay: string;
  getNextDay: () => string;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ currentDay, getNextDay }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-2">Academia Tracker</h2>
      <p className="text-blue-100 text-lg">
        Treino {currentDay} • Próximo: {getNextDay()}
      </p>
    </div>
  );
};

export default WorkoutHeader;
