import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { formatPrice } from "@/data/movies";
import { cancelBooking, loadBookings, type Booking } from "@/lib/bookings";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "My bookings | Cineloom" },
      {
        name: "description",
        content: "View your Cineloom ticket bookings, seat numbers and showtimes, or cancel them.",
      },
      { property: "og:title", content: "My bookings | Cineloom" },
      {
        property: "og:description",
        content: "View your Cineloom ticket bookings, seat numbers and showtimes.",
      },
    ],
  }),
  component: Bookings,
});

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBookings(loadBookings());
    setReady(true);
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-4xl text-foreground">My bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your tickets are saved on this device.
        </p>

        {ready && bookings.length === 0 && (
          <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">You haven't booked any tickets yet.</p>
            <Link
              to="/"
              className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse movies
            </Link>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              <img
                src={booking.poster}
                alt={`${booking.movieTitle} poster`}
                width={672}
                height={992}
                loading="lazy"
                className="h-28 w-20 rounded-lg object-cover"
              />
              <div className="min-w-48 flex-1">
                <h2 className="font-display text-2xl text-foreground">{booking.movieTitle}</h2>
                <p className="text-xs capitalize text-muted-foreground">
                  {booking.day} · {booking.time} · {booking.screen} · {booking.format}
                </p>
                <p className="mt-2 text-sm text-foreground">Seats {booking.seats.join(", ")}</p>
                <p className="text-xs text-muted-foreground">
                  Booking ref {booking.id.slice(-6).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl text-primary">{formatPrice(booking.total)}</p>
                <button
                  onClick={() => setBookings(cancelBooking(booking.id))}
                  className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                >
                  Cancel
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
