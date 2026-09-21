import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { formatDuration, getMovie, getShowtimesFor, type Showtime } from "@/data/movies";

export const Route = createFileRoute("/movie/$movieId")({
  loader: ({ params }) => {
    const movie = getMovie(params.movieId);
    if (!movie) throw notFound();
    return { movie };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.movie.title} | Cineloom` : "Movie | Cineloom";
    const description = loaderData?.movie.synopsis ?? "Movie details and showtimes at Cineloom.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: MovieDetail,
});

function MovieDetail() {
  const { movie } = Route.useLoaderData();
  const [day, setDay] = useState<Showtime["day"]>("today");
  const shows = getShowtimesFor(movie.id, day);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to all movies
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-[260px_1fr]">
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            width={672}
            height={992}
            className="w-48 rounded-xl border border-border md:w-full"
          />
          <div>
            <h1 className="font-display text-5xl text-foreground">{movie.title}</h1>
            <p className="mt-1 text-sm italic text-primary">{movie.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {[
                movie.rating,
                movie.language,
                formatDuration(movie.durationMinutes),
                `★ ${movie.score}`,
                ...movie.genres,
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {movie.synopsis}
            </p>
            <dl className="mt-5 space-y-1 text-sm text-muted-foreground">
              <div>
                <span className="text-foreground">Director:</span> {movie.director}
              </div>
              <div>
                <span className="text-foreground">Cast:</span> {movie.cast.join(", ")}
              </div>
            </dl>
          </div>
        </div>

        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-3xl text-foreground">Choose a showtime</h2>
            <div className="flex gap-2">
              {(["today", "tomorrow"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                    day === d
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {shows.map((show) => (
              <Link
                key={show.id}
                to="/book/$showtimeId"
                params={{ showtimeId: show.id }}
                className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
              >
                <p className="font-display text-2xl text-foreground">{show.time}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {show.screen} · {show.format}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
