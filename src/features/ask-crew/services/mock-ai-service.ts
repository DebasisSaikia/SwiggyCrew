import { pickResponseFor } from './mock-responses';

// Delay before the first token, so the loading indicator between the user's
// message and the reply has something to show.
const INITIAL_DELAY_MS = 500;
const TOKEN_DELAY_MS = 32;

/**
 * Mocks a streaming AI reply, per the assignment's technical constraint
 * ("mock data with delay, no streaming required") while still delivering the
 * progressive token-by-token reveal the screen spec describes.
 *
 * Each token yield is preceded by a real `setTimeout` (a macrotask), not a
 * microtask-only `await Promise.resolve()`. That distinction matters: chaining
 * bare microtasks between yields lets the whole loop drain within a single JS
 * turn, monopolizing the JS thread before it ever hands control back to the
 * renderer. `setTimeout` forces an actual yield back to the event loop between
 * tokens, which is what keeps this loop from ever tripping the JS-thread-busy
 * indicator while it runs alongside feed scrolling.
 */
export async function* streamAssistantReply(userMessage: string): AsyncGenerator<string> {
  await delay(INITIAL_DELAY_MS);

  const fullText = pickResponseFor(userMessage);
  const words = fullText.split(' ');

  for (const word of words) {
    await delay(TOKEN_DELAY_MS);
    yield word + ' ';
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
