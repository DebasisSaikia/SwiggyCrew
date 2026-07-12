const KEYWORD_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['beach', 'villa', 'relax'],
    response:
      "For a relaxed beach trip I'd point you toward a villa package — you get a private pool, a kitchen for slow mornings, and no fixed itinerary. Bali and Tulum both have strong villa options in the feed right now, usually 5 to 10 nights. Want me to narrow it down by budget?",
  },
  {
    keywords: ['hike', 'hiking', 'adventure', 'trek'],
    response:
      "If you're after something active, the Experience bundles are built around guided hikes and outdoor excursions rather than lounging. Patagonia and Banff both have multi-day trekking itineraries with a local guide included. How many days are you thinking?",
  },
  {
    keywords: ['budget', 'cheap', 'affordable'],
    response:
      "Budget-wise, Flight + Stay bundles tend to be the most efficient since the flight and hotel are priced together. Southeast Asia destinations like Chiang Mai and Hoi An usually come in lowest per night in the feed. Want me to filter for anything under a specific nightly rate?",
  },
  {
    keywords: ['food', 'eat', 'cuisine', 'restaurant'],
    response:
      'Good call — a few bundles have a food crawl or cooking class baked into the day-by-day itinerary, usually on day 1 or 2. Kyoto and Lisbon both lean heavily into that. Want a shortlist of food-forward trips?',
  },
];

const GENERIC_RESPONSES: string[] = [
  "I can help narrow that down. Tell me roughly how many nights you're thinking and whether you'd rather have a packed itinerary or mostly free time, and I'll point you at a few bundles from the feed that fit.",
  "There's a good mix of options open right now — Flight + Stay for convenience, Villas if you want your own space, or Experience trips if you'd rather have activities planned for you. Which sounds closer to what you want?",
  "Happy to help plan that. Do you have a destination in mind already, or would you like me to suggest a few based on the season?",
  'Got it. If you tap into any card in the feed and open "Details," you\'ll see the day-by-day breakdown — that usually makes it easier to compare two or three options side by side. Want me to suggest a shortlist?',
];

function normalize(text: string): string {
  return text.toLowerCase();
}

export function pickResponseFor(userMessage: string): string {
  const normalized = normalize(userMessage);

  const match = KEYWORD_RESPONSES.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );
  if (match) return match.response;

  const index = Math.abs(hashString(normalized)) % GENERIC_RESPONSES.length;
  return GENERIC_RESPONSES[index];
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
