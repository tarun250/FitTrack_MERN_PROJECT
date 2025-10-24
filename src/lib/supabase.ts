import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  goal: string;
  created_at: string;
  updated_at: string;
};

export type Workout = {
  id: string;
  user_id: string;
  activity_type: string;
  duration: number;
  calories_burned: number;
  distance: number | null;
  notes: string;
  original_input: string;
  workout_date: string;
  created_at: string;
};

export type Meal = {
  id: string;
  user_id: string;
  meal_type: string;
  food_items: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  original_input: string;
  meal_date: string;
  created_at: string;
};

export type DailyStat = {
  id: string;
  user_id: string;
  date: string;
  total_calories_burned: number;
  total_calories_consumed: number;
  total_workouts: number;
  total_workout_duration: number;
  created_at: string;
  updated_at: string;
};

export type Insight = {
  id: string;
  user_id: string;
  insight_type: string;
  message: string;
  date: string;
  is_read: boolean;
  created_at: string;
};
