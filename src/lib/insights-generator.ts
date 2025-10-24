import { DailyStat, Meal, Workout } from './supabase';

export type GeneratedInsight = {
  type: 'achievement' | 'recommendation' | 'warning';
  message: string;
};

export function generateInsights(
  todayStats: DailyStat | null,
  yesterdayStats: DailyStat | null,
  recentWorkouts: Workout[],
  recentMeals: Meal[]
): GeneratedInsight[] {
  const insights: GeneratedInsight[] = [];

  if (todayStats && yesterdayStats) {
    const caloriesDiff = todayStats.total_calories_burned - yesterdayStats.total_calories_burned;

    if (caloriesDiff > 0) {
      insights.push({
        type: 'achievement',
        message: `Great job! You burned ${Math.round(caloriesDiff)} more calories than yesterday.`,
      });
    }

    if (todayStats.total_workouts > yesterdayStats.total_workouts) {
      insights.push({
        type: 'achievement',
        message: `You're on fire! ${todayStats.total_workouts} workouts today vs ${yesterdayStats.total_workouts} yesterday.`,
      });
    }
  }

  if (todayStats) {
    const netCalories = todayStats.total_calories_consumed - todayStats.total_calories_burned;

    if (netCalories > 500) {
      insights.push({
        type: 'warning',
        message: `Your calorie intake is ${Math.round(netCalories)} calories above what you burned. Consider adding more activity.`,
      });
    }

    if (todayStats.total_workouts === 0) {
      insights.push({
        type: 'recommendation',
        message: 'No workouts logged today. Even a 15-minute walk can make a difference!',
      });
    }

    if (todayStats.total_workout_duration > 60) {
      insights.push({
        type: 'achievement',
        message: `Amazing! You've exercised for ${todayStats.total_workout_duration} minutes today.`,
      });
    }
  }

  if (recentMeals.length > 0) {
    const totalProtein = recentMeals.reduce((sum, meal) => sum + meal.protein, 0);

    if (totalProtein < 40) {
      insights.push({
        type: 'recommendation',
        message: 'Your protein intake is low today. Try adding eggs, chicken, paneer, or fish to your meals.',
      });
    }

    if (totalProtein >= 60) {
      insights.push({
        type: 'achievement',
        message: `Excellent protein intake today: ${Math.round(totalProtein)}g. Keep it up!`,
      });
    }
  }

  if (recentWorkouts.length >= 3) {
    insights.push({
      type: 'achievement',
      message: `Consistency is key! You've logged ${recentWorkouts.length} workouts recently. Keep the momentum going!`,
    });
  }

  const cardioWorkouts = recentWorkouts.filter(w =>
    w.activity_type.includes('Running') || w.activity_type.includes('Cycling') || w.activity_type.includes('Cardio')
  );

  if (cardioWorkouts.length === 0 && recentWorkouts.length > 0) {
    insights.push({
      type: 'recommendation',
      message: 'Consider adding some cardio exercises like running or cycling for heart health.',
    });
  }

  return insights;
}
