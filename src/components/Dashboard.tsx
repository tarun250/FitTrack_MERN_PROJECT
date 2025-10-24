import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Workout, Meal, DailyStat, Insight, Profile } from '../lib/supabase';
import { detectInputType, parseWorkoutInput, parseMealInput } from '../lib/nlp-parser';
import { generateInsights } from '../lib/insights-generator';
import { LogOut, TrendingUp, Flame, Utensils, Activity, Lightbulb, Moon, Sun } from 'lucide-react';
import { NaturalLanguageInput } from './NaturalLanguageInput';
import { StatsCard } from './StatsCard';
import { WorkoutList } from './WorkoutList';
import { MealList } from './MealList';
import { InsightsList } from './InsightsList';
import { ProgressChart } from './ProgressChart';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [todayStats, setTodayStats] = useState<DailyStat | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [weekStats, setWeekStats] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    setProfile(profileData);

    const today = new Date().toISOString().split('T')[0];

    const { data: todayData } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    setTodayStats(todayData);

    const { data: workoutsData } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .gte('workout_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('workout_date', { ascending: false });

    setWorkouts(workoutsData || []);

    const { data: mealsData } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .gte('meal_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('meal_date', { ascending: false });

    setMeals(mealsData || []);

    const { data: insightsData } = await supabase
      .from('insights')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('created_at', { ascending: false })
      .limit(5);

    setInsights(insightsData || []);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: weekData } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', sevenDaysAgo)
      .order('date', { ascending: true });

    setWeekStats(weekData || []);

    setLoading(false);
  };

  const handleNaturalLanguageInput = async (input: string) => {
    if (!user) return;

    const inputType = detectInputType(input);
    const today = new Date().toISOString().split('T')[0];

    if (inputType === 'workout') {
      const parsed = parseWorkoutInput(input);
      if (parsed) {
        const { error } = await supabase.from('workouts').insert({
          user_id: user.id,
          activity_type: parsed.activityType,
          duration: parsed.duration,
          calories_burned: parsed.calories || 0,
          distance: parsed.distance || null,
          original_input: input,
          workout_date: today,
        });

        if (!error) {
          await updateDailyStats();
          await generateAndSaveInsights();
          await loadData();
        }
      }
    } else if (inputType === 'meal') {
      const parsed = parseMealInput(input);
      if (parsed) {
        const { error } = await supabase.from('meals').insert({
          user_id: user.id,
          meal_type: parsed.mealType,
          food_items: parsed.foodItems,
          calories: parsed.calories || 0,
          protein: parsed.protein || 0,
          carbs: parsed.carbs || 0,
          fats: parsed.fats || 0,
          original_input: input,
          meal_date: today,
        });

        if (!error) {
          await updateDailyStats();
          await generateAndSaveInsights();
          await loadData();
        }
      }
    }
  };

  const updateDailyStats = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const { data: todayWorkouts } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .eq('workout_date', today);

    const { data: todayMeals } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .eq('meal_date', today);

    const totalCaloriesBurned = todayWorkouts?.reduce((sum, w) => sum + w.calories_burned, 0) || 0;
    const totalCaloriesConsumed = todayMeals?.reduce((sum, m) => sum + m.calories, 0) || 0;
    const totalWorkouts = todayWorkouts?.length || 0;
    const totalWorkoutDuration = todayWorkouts?.reduce((sum, w) => sum + w.duration, 0) || 0;

    await supabase.from('daily_stats').upsert({
      user_id: user.id,
      date: today,
      total_calories_burned: totalCaloriesBurned,
      total_calories_consumed: totalCaloriesConsumed,
      total_workouts: totalWorkouts,
      total_workout_duration: totalWorkoutDuration,
      updated_at: new Date().toISOString(),
    });
  };

  const generateAndSaveInsights = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data: todayData } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    const { data: yesterdayData } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', yesterday)
      .maybeSingle();

    const { data: recentWorkouts } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .gte('workout_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    const { data: recentMeals } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .eq('meal_date', today);

    const generatedInsights = generateInsights(
      todayData,
      yesterdayData,
      recentWorkouts || [],
      recentMeals || []
    );

    for (const insight of generatedInsights) {
      await supabase.from('insights').insert({
        user_id: user.id,
        insight_type: insight.type,
        message: insight.message,
        date: today,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your fitness data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  FitTrack AI
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Welcome back, {profile?.full_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:opacity-80 transition-opacity`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={signOut}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NaturalLanguageInput onSubmit={handleNaturalLanguageInput} darkMode={darkMode} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Flame className="w-6 h-6" />}
            title="Calories Burned"
            value={todayStats?.total_calories_burned || 0}
            unit="kcal"
            color="orange"
            darkMode={darkMode}
          />
          <StatsCard
            icon={<Utensils className="w-6 h-6" />}
            title="Calories Consumed"
            value={todayStats?.total_calories_consumed || 0}
            unit="kcal"
            color="green"
            darkMode={darkMode}
          />
          <StatsCard
            icon={<Activity className="w-6 h-6" />}
            title="Workouts"
            value={todayStats?.total_workouts || 0}
            unit="sessions"
            color="blue"
            darkMode={darkMode}
          />
          <StatsCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Active Time"
            value={todayStats?.total_workout_duration || 0}
            unit="min"
            color="teal"
            darkMode={darkMode}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProgressChart weekStats={weekStats} darkMode={darkMode} />
          </div>
          <InsightsList insights={insights} darkMode={darkMode} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkoutList workouts={workouts.slice(0, 5)} darkMode={darkMode} />
          <MealList meals={meals.slice(0, 5)} darkMode={darkMode} />
        </div>
      </main>
    </div>
  );
}
