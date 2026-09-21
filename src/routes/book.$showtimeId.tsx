import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { formatPrice, getMovie, getShowtime } from "@/data/movies";
import {
  PREMIUM_PRICE,
  PREMIUM_ROWS,
  ROWS,
  SEATS_PER_ROW,
  STANDARD_PRICE,
  seatPrice,
  soldSeatsFor,
} from "@/lib/seats";
import { bookedSeatsFor, saveBooking } from "@/lib/bookings";

export const Route = createFileRoute("/book/$showtimeId")({
  loader: ({ params }) => {
    const showtime = getShowtime(params.showtimeId);
    const movie = showtime ? getMovie(showtime.movieId) : undefined;
    if (!showtime || !movie) throw notFound();
    return { showtime, movie };
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `Select seats — ${loaderData.movie.title} | Cineloom`
      : "Select seats | Cineloom";
    const description = "Pick your seats and confirm your cinema booking at Cineloom.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: BookSeats,
});

function BookSeats() {
  const { showtime, movie } = Route.useLoaderData();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [taken, setTaken] = useState<Set<string>>(() => soldSeatsFor(showtime.id));

  useEffect(() => {
    setSelected([]);
    setTaken(new Set([...soldSeatsFor(showtime.id), ...bookedSeatsFor(showtime.id)]));
  }, [showtime.id]);

  const total = useMemo(
    () => selected.reduce((sum, seat) => sum + seatPrice(seat), 0),
    [selected],
  );

  const toggle = (seat: string) => {
    if (taken.has(seat)) return;
    setSelected((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : prev.length >= 8
          ? prev
          : [...prev, seat],
    );
  };

  const confirm = () => {
    if (selected.length === 0) return;
    saveBooking({
      id: `${showtime.id}-${Date.now()}`,
      movieId: movie.id,
      movieTitle: movie.title,
      poster: movie.poster,
      showtimeId: showtime.id,
      day: showtime.day,
      time: showtime.time,
      screen: showtime.screen,
      format: showtime.format,
      seats: [...selected].sort(),
      total,
      createdAt: new Date().toISOString(),
    });
    navigate({ to: "/bookings" });
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Link
          to="/movie/$movieId"
          params={{ movieId: movie.id }}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to {movie.title}
        </Link>

        <h1 className="mt-6 font-display text-4xl text-foreground">Select your seats</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {movie.title} · <span className="capitalize">{showtime.day}</span> {showtime.time} ·{" "}
          {showtime.screen} · {showtime.format}
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card/70 p-4 sm:p-8">
          <div className="mx-auto mb-8 h-2 w-3/4 rounded-full bg-primary/70 shadow-[0_8px_40px_0_oklch(0.82_0.16_78/0.5)]" />
          <p className="mb-6 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Screen this way
          </p>

          <div className="space-y-2 overflow-x-auto">
            {ROWS.map((row) => (
              <div key={row} className="flex items-center justify-center gap-1.5">
                <span className="w-5 text-xs text-muted-foreground">{row}</span>
                {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                  const seat = `${row}${i + 1}`;
                  const isTaken = taken.has(seat);
                  const isSelected = selected.includes(seat);
                  return (
                    <button
                      key={seat}
                      onClick={() => toggle(seat)}
                      disabled={isTaken}
                      aria-label={`Seat ${seat}${isTaken ? " unavailable" : ""}`}
                      className={`h-7 w-7 rounded-t-md border text-[10px] font-semibold transition-colors ${
                        isTaken
                          ? "cursor-not-allowed border-border bg-muted text-muted-foreground/50"
                          : isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : PREMIUM_ROWS.includes(row)
                              ? "border-primary/40 bg-secondary text-foreground hover:border-primary"
                              : "border-border bg-secondary/60 text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-sm border border-border bg-secondary/60" /> Standard{" "}
              {formatPrice(STANDARD_PRICE)}
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-sm border border-primary/40 bg-secondary" /> Premium{" "}
              {formatPrice(PREMIUM_PRICE)}
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-sm bg-primary" /> Selected
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-sm bg-muted" /> Taken
            </span>
          </div>
        </div>

        <div className="sticky bottom-4 mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-sm text-foreground">
              {selected.length > 0
                ? `${selected.length} seat${selected.length > 1 ? "s" : ""}: ${[...selected].sort().join(", ")}`
                : "No seats selected yet"}
            </p>
            <p className="font-display text-2xl text-primary">{formatPrice(total)}</p>
          </div>
          <button
            onClick={confirm}
            disabled={selected.length === 0}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Confirm booking
          </button>
        </div>
      </div>
    </div>
  );
}
