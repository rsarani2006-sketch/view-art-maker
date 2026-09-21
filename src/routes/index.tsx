import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import {
  allGenres,
  allLanguages,
  formatDuration,
  movies,
  type Movie,
} from "@/data/movies";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Now showing | Cineloom" },
      {
        name: "description",
        content:
          "Browse every movie playing this week, filter by genre or language, and book your seats at Cineloom.",
      },
      { property: "og:title", content: "Now showing | Cineloom" },
      {
        property: "og:description",
        content: "Browse every movie playing this week and book your seats at Cineloom.",
      },
    ],
  }),
  component: Index,
});

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      to="/movie/$movieId"
      params={{ movieId: movie.id }}
      className="group overflow-hidden rounded-xl border border-border bg-card transition-transform duration-200 hover:-translate-y-1 hover:border-primary/60"
    >
      <div className="relative aspect-2/3 overflow-hidden">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          width={672}
          height={992}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-2 top-2 rounded-md bg-background/85 px-2 py-1 text-xs font-semibold text-primary">
          ★ {movie.score}
        </span>
      </div>
      <div className="space-y-1 p-4">
        <h3 className="font-display text-xl text-foreground">{movie.title}</h3>
        <p className="text-xs text-muted-foreground">
          {movie.genres.join(" • ")} · {movie.language} · {formatDuration(movie.durationMinutes)}
        </p>
      </div>
    </Link>
  );
}

function Index() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [language, setLanguage] = useState("All");

  const results = useMemo(
    () =>
      movies.filter((movie) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          movie.title.toLowerCase().includes(q) ||
          movie.cast.some((c) => c.toLowerCase().includes(q)) ||
          movie.genres.some((g) => g.toLowerCase().includes(q));
        const matchesGenre = genre === "All" || movie.genres.includes(genre);
        const matchesLanguage = language === "All" || movie.language === language;
        return matchesQuery && matchesGenre && matchesLanguage;
      }),
    [query, genre, language],
  );

  const featured = movies[0]!;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="grid items-center gap-8 rounded-2xl border border-border bg-card/60 p-6 md:grid-cols-[220px_1fr] md:p-10">
          <img
            src={featured.poster}
            alt={`${featured.title} poster`}
            width={672}
            height={992}
            className="mx-auto w-40 rounded-xl border border-border md:w-full"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Featured this week
            </p>
            <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">
              {featured.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{featured.synopsis}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/movie/$movieId"
                params={{ movieId: featured.id }}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Book tickets
              </Link>
              <Link
                to="/bookings"
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                My bookings
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display text-3xl text-foreground">Now showing</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies or cast…"
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary sm:w-64"
            />
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="All">All genres</option>
              {allGenres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="All">All languages</option>
              {allLanguages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No movies match that search. Try a different title or filter.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
