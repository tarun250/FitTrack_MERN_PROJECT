type Props = {
  icon: React.ReactNode;
  title: string;
  value: number;
  unit: string;
  color: 'orange' | 'green' | 'blue' | 'teal';
  darkMode: boolean;
};

const colorClasses = {
  orange: {
    light: 'bg-orange-50 text-orange-600',
    dark: 'bg-orange-900/30 text-orange-400',
  },
  green: {
    light: 'bg-green-50 text-green-600',
    dark: 'bg-green-900/30 text-green-400',
  },
  blue: {
    light: 'bg-blue-50 text-blue-600',
    dark: 'bg-blue-900/30 text-blue-400',
  },
  teal: {
    light: 'bg-teal-50 text-teal-600',
    dark: 'bg-teal-900/30 text-teal-400',
  },
};

export function StatsCard({ icon, title, value, unit, color, darkMode }: Props) {
  const colorClass = darkMode ? colorClasses[color].dark : colorClasses[color].light;

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
      <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
        {title}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </span>
        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          {unit}
        </span>
      </div>
    </div>
  );
}
