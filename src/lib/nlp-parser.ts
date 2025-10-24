export type ParsedWorkout = {
  activityType: string;
  duration: number;
  distance?: number;
  calories?: number;
};

export type ParsedMeal = {
  mealType: string;
  foodItems: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
};

const activityKeywords: Record<string, { type: string; caloriesPerMin: number }> = {
  running: { type: 'Running', caloriesPerMin: 10 },
  jogging: { type: 'Running', caloriesPerMin: 8 },
  run: { type: 'Running', caloriesPerMin: 10 },
  ran: { type: 'Running', caloriesPerMin: 10 },
  yoga: { type: 'Yoga', caloriesPerMin: 3 },
  cycling: { type: 'Cycling', caloriesPerMin: 8 },
  biking: { type: 'Cycling', caloriesPerMin: 8 },
  bike: { type: 'Cycling', caloriesPerMin: 8 },
  swimming: { type: 'Swimming', caloriesPerMin: 9 },
  swim: { type: 'Swimming', caloriesPerMin: 9 },
  walking: { type: 'Walking', caloriesPerMin: 4 },
  walk: { type: 'Walking', caloriesPerMin: 4 },
  walked: { type: 'Walking', caloriesPerMin: 4 },
  gym: { type: 'Gym Workout', caloriesPerMin: 7 },
  workout: { type: 'Gym Workout', caloriesPerMin: 7 },
  weights: { type: 'Weight Training', caloriesPerMin: 6 },
  cardio: { type: 'Cardio', caloriesPerMin: 9 },
  hiit: { type: 'HIIT', caloriesPerMin: 12 },
  dance: { type: 'Dancing', caloriesPerMin: 6 },
  dancing: { type: 'Dancing', caloriesPerMin: 6 },
};

const mealTypeKeywords: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

const foodCalories: Record<string, { calories: number; protein: number; carbs: number; fats: number }> = {
  oats: { calories: 150, protein: 5, carbs: 27, fats: 3 },
  milk: { calories: 100, protein: 8, carbs: 12, fats: 2 },
  eggs: { calories: 140, protein: 12, carbs: 1, fats: 10 },
  egg: { calories: 70, protein: 6, carbs: 0.5, fats: 5 },
  chicken: { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  rice: { calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
  bread: { calories: 80, protein: 4, carbs: 15, fats: 1 },
  banana: { calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
  apple: { calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
  salad: { calories: 50, protein: 2, carbs: 10, fats: 0.5 },
  pasta: { calories: 200, protein: 7, carbs: 42, fats: 1.3 },
  paneer: { calories: 265, protein: 18, carbs: 1.2, fats: 20 },
  yogurt: { calories: 100, protein: 10, carbs: 13, fats: 0.4 },
  fish: { calories: 206, protein: 22, carbs: 0, fats: 12 },
  vegetables: { calories: 50, protein: 2, carbs: 11, fats: 0.2 },
};

export function parseWorkoutInput(input: string): ParsedWorkout | null {
  const lowerInput = input.toLowerCase();

  let activityType = 'General Exercise';
  let caloriesPerMin = 5;

  for (const [keyword, data] of Object.entries(activityKeywords)) {
    if (lowerInput.includes(keyword)) {
      activityType = data.type;
      caloriesPerMin = data.caloriesPerMin;
      break;
    }
  }

  const durationMatch = lowerInput.match(/(\d+)\s*(min|minute|minutes|mins|hour|hours|hr|hrs)/);
  let duration = 0;

  if (durationMatch) {
    const value = parseInt(durationMatch[1]);
    const unit = durationMatch[2];

    if (unit.startsWith('hour') || unit.startsWith('hr')) {
      duration = value * 60;
    } else {
      duration = value;
    }
  }

  const distanceMatch = lowerInput.match(/(\d+(?:\.\d+)?)\s*(km|kilometer|kilometers|mile|miles|mi)/);
  let distance: number | undefined;

  if (distanceMatch) {
    const value = parseFloat(distanceMatch[1]);
    const unit = distanceMatch[2];

    if (unit.startsWith('mile') || unit === 'mi') {
      distance = value * 1.609;
    } else {
      distance = value;
    }

    if (duration === 0 && distance) {
      duration = Math.round(distance * 6);
    }
  }

  if (duration === 0 && (lowerInput.includes('did') || lowerInput.includes('completed'))) {
    duration = 30;
  }

  if (duration === 0) {
    return null;
  }

  const calories = Math.round(duration * caloriesPerMin);

  return {
    activityType,
    duration,
    distance,
    calories,
  };
}

export function parseMealInput(input: string): ParsedMeal | null {
  const lowerInput = input.toLowerCase();

  let mealType = 'Snack';
  for (const [keyword, type] of Object.entries(mealTypeKeywords)) {
    if (lowerInput.includes(keyword)) {
      mealType = type;
      break;
    }
  }

  const words = lowerInput.split(/[\s,]+/);
  const detectedFoods: string[] = [];
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  for (const word of words) {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (foodCalories[cleanWord]) {
      detectedFoods.push(cleanWord);
      totalCalories += foodCalories[cleanWord].calories;
      totalProtein += foodCalories[cleanWord].protein;
      totalCarbs += foodCalories[cleanWord].carbs;
      totalFats += foodCalories[cleanWord].fats;
    }
  }

  if (detectedFoods.length === 0) {
    const ateMatch = lowerInput.match(/ate\s+(.+?)(?:\s+for|$)/);
    const hadMatch = lowerInput.match(/had\s+(.+?)(?:\s+for|$)/);
    const foodMatch = ateMatch || hadMatch;

    if (foodMatch) {
      const foodItems = foodMatch[1].trim();
      return {
        mealType,
        foodItems,
        calories: 200,
        protein: 10,
        carbs: 30,
        fats: 5,
      };
    }

    return null;
  }

  return {
    mealType,
    foodItems: detectedFoods.join(', '),
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10,
    fats: Math.round(totalFats * 10) / 10,
  };
}

export function detectInputType(input: string): 'workout' | 'meal' | 'unknown' {
  const lowerInput = input.toLowerCase();

  const workoutIndicators = ['did', 'ran', 'run', 'walked', 'swim', 'cycling', 'yoga', 'workout', 'exercise', 'gym', 'minutes', 'mins', 'km', 'mile'];
  const mealIndicators = ['ate', 'had', 'breakfast', 'lunch', 'dinner', 'snack', 'food', 'meal'];

  const workoutScore = workoutIndicators.reduce((score, indicator) =>
    score + (lowerInput.includes(indicator) ? 1 : 0), 0);

  const mealScore = mealIndicators.reduce((score, indicator) =>
    score + (lowerInput.includes(indicator) ? 1 : 0), 0);

  if (workoutScore > mealScore) return 'workout';
  if (mealScore > workoutScore) return 'meal';
  return 'unknown';
}
