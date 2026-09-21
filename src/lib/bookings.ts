export type Booking = {
  id: string;
  movieId: string;
  movieTitle: string;
  poster: string;
  showtimeId: string;
  day: string;
  time: string;
  screen: string;
  format: string;
  seats: string[];
  total: number;
  createdAt: string;
};

const KEY = "cineloom.bookings.v1";

export const loadBookings = (): Booking[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
};

export const saveBooking = (booking: Booking) => {
  const next = [booking, ...loadBookings()];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const cancelBooking = (id: string) => {
  const next = loadBookings().filter((b) => b.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const bookedSeatsFor = (showtimeId: string): string[] =>
  loadBookings()
    .filter((b) => b.showtimeId === showtimeId)
    .flatMap((b) => b.seats);
