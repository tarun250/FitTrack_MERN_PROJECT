import { DailyStat } from '../lib/supabase';
import { TrendingUp } from 'lucide-react';

type Props = {
  weekStats: DailyStat[];
  darkMode: boolean;
};

export function ProgressChart({ weekStats, darkMode }: Props) {
  const maxCalories = Math.max(
    ...weekStats.map((s) => Math.max(s.total_calories_burned, s.total_calories_consumed)),
    100
  );

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Weekly Progress
        </h2>
      </div>

      {weekStats.length === 0 ? (
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-12`}>
          No data available yet. Start logging to see your progress!
        </p>
      ) : (
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-2 h-48">
            {weekStats.map((stat) => {
              const burnedHeight = (stat.total_calories_burned / maxCalories) * 100;
              const consumedHeight = (stat.total_calories_consumed / maxCalories) * 100;
              const date = new Date(stat.date);
              const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={stat.id} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex justify-center gap-1 h-full items-end">
                    <div
                      className="w-full bg-orange-500 rounded-t-md transition-all hover:opacity-80 relative group"
                      style={{ height: `${burnedHeight}%`, minHeight: '4px' }}
                    >
                      <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-900'} text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                        Burned: {Math.round(stat.total_calories_burned)} kcal
                      </div>
                    </div>
                    <div
                      className="w-full bg-green-500 rounded-t-md transition-all hover:opacity-80 relative group"
                      style={{ height: `${consumedHeight}%`, minHeight: '4px' }}
                    >
                      <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-900'} text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                        Consumed: {Math.round(stat.total_calories_consumed)} kcal
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Burned
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Consumed
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
