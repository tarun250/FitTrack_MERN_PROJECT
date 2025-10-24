import { Insight } from '../lib/supabase';
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

type Props = {
  insights: Insight[];
  darkMode: boolean;
};

export function InsightsList({ insights, darkMode }: Props) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <TrendingUp className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getColorClasses = (type: string) => {
    if (darkMode) {
      switch (type) {
        case 'achievement':
          return 'bg-green-900/30 border-green-800 text-green-400';
        case 'warning':
          return 'bg-yellow-900/30 border-yellow-800 text-yellow-400';
        default:
          return 'bg-blue-900/30 border-blue-800 text-blue-400';
      }
    } else {
      switch (type) {
        case 'achievement':
          return 'bg-green-50 border-green-200 text-green-700';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-700';
        default:
          return 'bg-blue-50 border-blue-200 text-blue-700';
      }
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          AI Insights
        </h2>
      </div>

      {insights.length === 0 ? (
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-8 text-sm`}>
          Keep logging your activities to get personalized insights!
        </p>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`${getColorClasses(insight.insight_type)} border rounded-lg p-4`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{getIcon(insight.insight_type)}</div>
                <p className="text-sm leading-relaxed">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
