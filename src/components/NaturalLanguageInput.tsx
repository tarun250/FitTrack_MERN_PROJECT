import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

type Props = {
  onSubmit: (input: string) => Promise<void>;
  darkMode: boolean;
};

export function NaturalLanguageInput({ onSubmit, darkMode }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    await onSubmit(input);
    setInput('');
    setLoading(false);
  };

  const examples = [
    'I ran 5 km in 30 minutes',
    'I did 45 minutes of yoga today',
    'I ate oats and milk for breakfast',
    'Had chicken rice and salad for lunch',
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-8`}>
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Log Your Activity
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me what you did... (e.g., 'I ran 5 km' or 'I ate oats for breakfast')"
          className={`flex-1 px-4 py-3 rounded-lg ${
            darkMode
              ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
              : 'bg-gray-50 text-gray-900 border-gray-300'
          } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          {loading ? 'Logging...' : 'Log'}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {examples.map((example, idx) => (
          <button
            key={idx}
            onClick={() => setInput(example)}
            className={`px-3 py-1.5 rounded-full text-sm ${
              darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            } transition-colors`}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
