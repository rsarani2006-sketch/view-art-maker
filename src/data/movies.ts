import neonOrbit from "@/assets/poster-neon-orbit.jpg";
import paperLanterns from "@/assets/poster-paper-lanterns.jpg";
import ironMonsoon from "@/assets/poster-iron-monsoon.jpg";
import cloudKite from "@/assets/poster-cloud-kite.jpg";

export type Showtime = {
  id: string;
  movieId: string;
  day: "today" | "tomorrow";
  time: string;
  screen: string;
  format: "2D" | "3D" | "IMAX";
};

export type Movie = {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  genres: string[];
  language: string;
  durationMinutes: number;
  rating: string;
  score: number;
  poster: string;
  cast: string[];
  director: string;
};

export const movies: Movie[] = [
  {
    id: "neon-orbit",
    title: "Neon Orbit",
    tagline: "Some worlds aren't meant to be found.",
    synopsis:
      "A salvage pilot stranded on a ringed exoplanet discovers a signal that predates humanity — and something out there is answering back.",
    genres: ["Sci-Fi", "Thriller"],
    language: "English",
    durationMinutes: 142,
    rating: "UA",
    score: 8.4,
    poster: neonOrbit,
    cast: ["Jordan Vale", "Emery Sloane", "Nia Okafor"],
    director: "Elias Korven",
  },
  {
    id: "paper-lanterns",
    title: "Paper Lanterns",
    tagline: "A love that floats beyond time.",
    synopsis:
      "Two strangers meet at a river festival and promise to return every year. Time, distance and one unsent letter have other plans.",
    genres: ["Romance", "Drama"],
    language: "English",
    durationMinutes: 118,
    rating: "U",
    score: 7.9,
    poster: paperLanterns,
    cast: ["Elise Moreau", "Jordan Kellen", "Mira Sen"],
    director: "Sophie Lang",
  },
  {
    id: "iron-monsoon",
    title: "Iron Monsoon",
    tagline: "Bigger risks. Bigger scores.",
    synopsis:
      "A retired getaway driver is pulled into one last job during the heaviest storm the city has seen in a century.",
    genres: ["Action", "Crime"],
    language: "Hindi",
    durationMinutes: 131,
    rating: "A",
    score: 8.1,
    poster: ironMonsoon,
    cast: ["Devon Kale", "Lila Vargas", "Samir Khan"],
    director: "Marcus Vale",
  },
  {
    id: "cloud-kite",
    title: "Cloud Kite",
    tagline: "Dreams take flight.",
    synopsis:
      "A boy and his scruffy dog chase a runaway kite into a kingdom built on clouds, where every wish costs something.",
    genres: ["Animation", "Family"],
    language: "English",
    durationMinutes: 96,
    rating: "U",
    score: 8.7,
    poster: cloudKite,
    cast: ["Arun Beck", "Poppy Hale", "Grace Idowu"],
    director: "Tomas Reyes",
  },
];

const TIMES: Record<string, { time: string; screen: string; format: Showtime["format"] }[]> = {
  "neon-orbit": [
    { time: "10:15 AM", screen: "Audi 1", format: "IMAX" },
    { time: "02:40 PM", screen: "Audi 1", format: "IMAX" },
    { time: "07:20 PM", screen: "Audi 3", format: "3D" },
    { time: "10:45 PM", screen: "Audi 3", format: "2D" },
  ],
  "paper-lanterns": [
    { time: "11:00 AM", screen: "Audi 2", format: "2D" },
    { time: "03:30 PM", screen: "Audi 2", format: "2D" },
    { time: "08:05 PM", screen: "Audi 4", format: "2D" },
  ],
  "iron-monsoon": [
    { time: "12:10 PM", screen: "Audi 4", format: "2D" },
    { time: "06:00 PM", screen: "Audi 1", format: "IMAX" },
    { time: "09:50 PM", screen: "Audi 2", format: "2D" },
  ],
  "cloud-kite": [
    { time: "09:45 AM", screen: "Audi 3", format: "3D" },
    { time: "01:20 PM", screen: "Audi 3", format: "2D" },
    { time: "05:15 PM", screen: "Audi 4", format: "3D" },
  ],
};

export const showtimes: Showtime[] = movies.flatMap((movie) =>
  (["today", "tomorrow"] as const).flatMap((day) =>
    (TIMES[movie.id] ?? []).map((slot) => ({
      id: `${movie.id}-${day}-${slot.time.replace(/[:\s]/g, "")}`,
      movieId: movie.id,
      day,
      ...slot,
    })),
  ),
);

export const getMovie = (id: string) => movies.find((m) => m.id === id);
export const getShowtime = (id: string) => showtimes.find((s) => s.id === id);
export const getShowtimesFor = (movieId: string, day: Showtime["day"]) =>
  showtimes.filter((s) => s.movieId === movieId && s.day === day);

export const allGenres = Array.from(new Set(movies.flatMap((m) => m.genres))).sort();
export const allLanguages = Array.from(new Set(movies.map((m) => m.language))).sort();

export const formatDuration = (minutes: number) =>
  `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

export const formatPrice = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise);
