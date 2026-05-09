/**
 * Reviews module. v1 returns curated quotes; v2 will swap the implementation
 * of `getReviews()` to fetch live Google Places + cached TripAdvisor data.
 */

export type Review = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  source: "Google" | "TripAdvisor";
  /** ISO date string */
  date?: string;
};

export const reviews: Review[] = [
  {
    author: "Sarah W.",
    rating: 5,
    quote:
      "Genuinely the best curry in Maidenhead. The lamb rogan josh is slow-cooked properly, the breads are fresh, and the team always remember our usual order.",
    source: "Google",
    date: "2025-11-12",
  },
  {
    author: "James P.",
    rating: 5,
    quote:
      "Sunday buffet is unreal value. Took the family of six and we waddled out happy. Service was warm without being fussy.",
    source: "TripAdvisor",
    date: "2025-09-30",
  },
  {
    author: "Aisha R.",
    rating: 5,
    quote:
      "Vegetarian options are genuinely thoughtful — not just paneer in three sauces. Their tarka daal alone is worth the trip.",
    source: "Google",
    date: "2025-08-21",
  },
  {
    author: "David L.",
    rating: 5,
    quote:
      "Ordered for a thirtieth birthday at home. Twenty plates, all on time, all hot, all properly spiced. Will use again.",
    source: "Google",
    date: "2025-07-04",
  },
  {
    author: "Priya K.",
    rating: 5,
    quote:
      "Reminded me of my nani’s kitchen in Punjab — and I do not say that lightly. Real food, real heat, properly seasoned.",
    source: "TripAdvisor",
    date: "2025-06-18",
  },
  {
    author: "Mark H.",
    rating: 5,
    quote:
      "Been coming here for years. Friendly faces every time, consistent kitchen, and the chicken tikka biryani is the best for miles.",
    source: "Google",
    date: "2025-05-09",
  },
  {
    author: "Emma T.",
    rating: 4,
    quote:
      "Lovely room, gentle lighting, food was full of flavour. Can get busy on weekends — book ahead.",
    source: "TripAdvisor",
    date: "2025-04-22",
  },
  {
    author: "Rohan S.",
    rating: 5,
    quote:
      "Free delivery within two miles, always on time, never soggy. Our Friday-night ritual.",
    source: "Google",
    date: "2025-03-15",
  },
  {
    author: "Helen M.",
    rating: 5,
    quote:
      "Their Maidenhead Spice house curry is something special — fragrant, layered, not too heavy. I dream about it.",
    source: "TripAdvisor",
    date: "2025-02-02",
  },
];

export const reviewsHighlight = reviews.slice(0, 3);

/**
 * Fetches reviews. v1 returns curated data; v2 will hit Google Places API
 * and cached TripAdvisor data without changing the call sites.
 */
export async function getReviews(): Promise<Review[]> {
  return reviews;
}
