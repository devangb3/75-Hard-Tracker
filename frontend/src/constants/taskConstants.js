import { 
  Droplet, 
  Dumbbell, 
  BookOpen, 
  Snowflake, 
  Apple, 
  X, 
  Camera,
  Sun,
  Home
} from "lucide-react";

export const TASK_ICONS = {
  drink_gallon_water: Droplet,
  workout_a: Home,
  workout_b_outside: Sun,
  read_ten_pages: BookOpen,
  five_min_cold_shower: Snowflake,
  follow_diet: Apple,
  no_alcohol_or_cheat_meals: X,
  take_progress_pic: Camera
};

export const TASK_NAMES = {
  drink_gallon_water: "Drink 1 Gallon Water",
  workout_a: "Workout A (45 min)",
  workout_b_outside: "Workout B (Outside - 45 min)",
  read_ten_pages: "Read 10 Pages",
  five_min_cold_shower: "5-Min Cold Shower",
  follow_diet: "Follow Diet",
  no_alcohol_or_cheat_meals: "No Alcohol/Cheat Meals",
  take_progress_pic: "Take Progress Picture"
};

export const WATER_GOAL_ML = 3785; // 1 gallon in ml
export const WATER_INCREMENT_OPTIONS = [250, 500, 1000];

export const API_BASE_URL = 'http://localhost:8917'; 