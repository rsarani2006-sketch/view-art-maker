export const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const SEATS_PER_ROW = 12;

export const PREMIUM_ROWS = ["F", "G", "H"];
export const STANDARD_PRICE = 250;
export const PREMIUM_PRICE = 420;

export const seatPrice = (seatId: string) =>
  PREMIUM_ROWS.includes(seatId[0]) ? PREMIUM_PRICE : STANDARD_PRICE;

const hash = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

/** Deterministic "already sold" seats so a show looks the same on every visit. */
export const soldSeatsFor = (showtimeId: string): Set<string> => {
  const sold = new Set<string>();
  ROWS.forEach((row, rowIndex) => {
    for (let seat = 1; seat <= SEATS_PER_ROW; seat += 1) {
      const id = `${row}${seat}`;
      if (hash(`${showtimeId}:${id}`) % 100 < 22 + rowIndex * 2) sold.add(id);
    }
  });
  return sold;
};
