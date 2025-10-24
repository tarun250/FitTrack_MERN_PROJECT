import { Meal } from '../lib/supabase';
import { Utensils } from 'lucide-react';

type Props = {
  meals: Meal[];
  darkMode: boolean;
};

export function MealList({ meals, darkMode }: Props) {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <Utensils className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Recent Meals
        </h2>
      </div>

      {meals.length === 0 ? (
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-8`}>
          No meals logged yet. Start tracking your nutrition!
        </p>
      ) : (
        <div className="space-y-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={`${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              } border rounded-lg p-4`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {meal.meal_type}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    {meal.food_items}
                  </p>
                </div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(meal.meal_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Calories
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {Math.round(meal.calories)}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Protein
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {meal.protein.toFixed(1)}g
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Carbs
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {meal.carbs.toFixed(1)}g
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Fats
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {meal.fats.toFixed(1)}g
                  </p>
                </div>
              </div>
              {meal.original_input && (
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2 italic`}>
                  "{meal.original_input}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
