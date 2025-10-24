/*
  # Fitness Tracker Database Schema

  ## Overview
  Creates the complete database structure for a personalized fitness tracking application
  with support for workouts, meals, goals, and progress tracking.

  ## New Tables
  
  ### 1. `profiles`
  Extended user profile information:
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `age` (integer)
  - `weight` (decimal) - in kg
  - `height` (decimal) - in cm
  - `goal` (text) - fitness goal description
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `workouts`
  Stores workout activity logs:
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `activity_type` (text) - e.g., running, yoga, cycling
  - `duration` (integer) - in minutes
  - `calories_burned` (decimal)
  - `distance` (decimal) - optional, in km
  - `notes` (text) - user notes or NLP original input
  - `original_input` (text) - stores the natural language input
  - `workout_date` (date)
  - `created_at` (timestamptz)

  ### 3. `meals`
  Stores meal and nutrition logs:
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `meal_type` (text) - breakfast, lunch, dinner, snack
  - `food_items` (text)
  - `calories` (decimal)
  - `protein` (decimal) - in grams
  - `carbs` (decimal) - in grams
  - `fats` (decimal) - in grams
  - `original_input` (text) - stores the natural language input
  - `meal_date` (date)
  - `created_at` (timestamptz)

  ### 4. `daily_stats`
  Aggregated daily statistics:
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `date` (date)
  - `total_calories_burned` (decimal)
  - `total_calories_consumed` (decimal)
  - `total_workouts` (integer)
  - `total_workout_duration` (integer) - in minutes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `insights`
  Stores AI-generated insights and recommendations:
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `insight_type` (text) - achievement, recommendation, warning
  - `message` (text)
  - `date` (date)
  - `is_read` (boolean)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies ensure users can only access their own data
  - Separate policies for SELECT, INSERT, UPDATE, and DELETE operations
  - All policies require authentication

  ## Important Notes
  1. All tables have proper foreign key constraints
  2. Indexes added for frequently queried columns (user_id, dates)
  3. Default values set for timestamps and boolean fields
  4. RLS policies are restrictive by default
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  age integer,
  weight decimal(5,2),
  height decimal(5,2),
  goal text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  duration integer NOT NULL,
  calories_burned decimal(8,2) DEFAULT 0,
  distance decimal(8,2),
  notes text DEFAULT '',
  original_input text DEFAULT '',
  workout_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  meal_type text NOT NULL,
  food_items text NOT NULL,
  calories decimal(8,2) DEFAULT 0,
  protein decimal(6,2) DEFAULT 0,
  carbs decimal(6,2) DEFAULT 0,
  fats decimal(6,2) DEFAULT 0,
  original_input text DEFAULT '',
  meal_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create daily_stats table
CREATE TABLE IF NOT EXISTS daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_calories_burned decimal(8,2) DEFAULT 0,
  total_calories_consumed decimal(8,2) DEFAULT 0,
  total_workouts integer DEFAULT 0,
  total_workout_duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create insights table
CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_type text NOT NULL,
  message text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS workouts_user_id_idx ON workouts(user_id);
CREATE INDEX IF NOT EXISTS workouts_date_idx ON workouts(workout_date);
CREATE INDEX IF NOT EXISTS meals_user_id_idx ON meals(user_id);
CREATE INDEX IF NOT EXISTS meals_date_idx ON meals(meal_date);
CREATE INDEX IF NOT EXISTS daily_stats_user_date_idx ON daily_stats(user_id, date);
CREATE INDEX IF NOT EXISTS insights_user_id_idx ON insights(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Workouts policies
CREATE POLICY "Users can view own workouts"
  ON workouts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts"
  ON workouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
  ON workouts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
  ON workouts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Meals policies
CREATE POLICY "Users can view own meals"
  ON meals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Daily stats policies
CREATE POLICY "Users can view own stats"
  ON daily_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON daily_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON daily_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stats"
  ON daily_stats FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insights policies
CREATE POLICY "Users can view own insights"
  ON insights FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights"
  ON insights FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights"
  ON insights FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights"
  ON insights FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);