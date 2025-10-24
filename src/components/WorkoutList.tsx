import { Workout } from '../lib/supabase';
import { Activity } from 'lucide-react';

type Props = {
  workouts: Workout[];
  darkMode: boolean;
};

export function WorkoutList({ workouts, darkMode }: Props) {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <Activity className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Recent Workouts
        </h2>
      </div>

      {workouts.length === 0 ? (
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-8`}>
          No workouts logged yet. Start by logging your first workout!
        </p>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className={`${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              } border rounded-lg p-4`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {workout.activity_type}
                </h3>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(workout.workout_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Duration
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {workout.duration} min
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Calories
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {Math.round(workout.calories_burned)} kcal
                  </p>
                </div>
                {workout.distance && (
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Distance
                    </p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {workout.distance.toFixed(1)} km
                    </p>
                  </div>
                )}
              </div>
              {workout.original_input && (
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2 italic`}>
                  "{workout.original_input}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
