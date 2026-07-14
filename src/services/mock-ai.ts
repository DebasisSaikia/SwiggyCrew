const REPLIES = [
  'Santorini fits well — 5 days, flight + stay, $1,560 for two. Want me to check dates?',
  'Checking pool availability for your dates now — most cliffside suites there include a private plunge pool. I will confirm the exact villa shortly.',
  'Bali in early October looks great — flights are running about $1,240 for a 5-day flight + villa package. Want me to pull a few villa options?',
  'For that budget, I would suggest a 4-day Experience package instead — more activities per dollar and no flight lock-in. Want me to swap the search?',
  'Rates are looking best mid-week — Tuesday through Saturday departures save roughly 15% over weekend flights.',
  'I can hold a Flight + Stay bundle for 24 hours while you decide — just say the word and I will lock it in.',
  'That villa has 3 bedrooms and a rooftop terrace — good fit if you are traveling with the group you mentioned earlier.',
  'Good news — there is a direct flight option that shaves about 4 hours off the layover route, for roughly $80 more.',
];

function pickReply(prompt: string): string {
  let hash = 0;
  for (let i = 0; i < prompt.length; i += 1) {
    hash = (hash * 31 + prompt.charCodeAt(i)) >>> 0;
  }
  return REPLIES[hash % REPLIES.length];
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Client-side mock of token-by-token AI streaming (CLAUDE.md "Resolved
 * ambiguity: AI streaming") — a chunked async generator with randomized
 * per-token delay, not a real API call. Reply text is a deterministic
 * function of the prompt so the same question always yields the same answer.
 */
export async function* streamAssistantReply(prompt: string): AsyncGenerator<string> {
  const reply = pickReply(prompt);
  const words = reply.split(' ');

  for (let i = 0; i < words.length; i += 1) {
    await delay(30 + Math.random() * 70);
    yield i === 0 ? words[i] : ` ${words[i]}`;
  }
}
