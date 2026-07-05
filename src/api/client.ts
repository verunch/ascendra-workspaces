/**
 * Thin typed mock client: simulates a real network boundary (latency,
 * error, empty) in front of the in-memory store, so every screen can
 * exercise real loading / error / empty states against a typed client
 * instead of hardcoded UI (docs/architecture.md §7).
 */

export interface MockClientConfig {
  /** Artificial network latency applied to every request. */
  delayMs: number;
  /** When true, every request rejects with a MockApiError. */
  simulateError: boolean;
  /** When true, list-style requests resolve with their configured empty value. */
  simulateEmpty: boolean;
}

const config: MockClientConfig = {
  delayMs: 500,
  simulateError: false,
  simulateEmpty: false,
};

export function getMockConfig(): Readonly<MockClientConfig> {
  return { ...config };
}

export function setMockConfig(patch: Partial<MockClientConfig>): void {
  Object.assign(config, patch);
}

export class MockApiError extends Error {
  constructor(message = "The mock API request failed.") {
    super(message);
    this.name = "MockApiError";
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function throwIfSimulatedError(): void {
  if (config.simulateError) {
    throw new MockApiError();
  }
}

/**
 * Wraps a synchronous data-access function with artificial latency plus
 * the toggleable error/empty branches above.
 */
export async function mockRequest<T>(
  resolver: () => T,
  options?: { emptyValue: T },
): Promise<T> {
  await delay(config.delayMs);

  throwIfSimulatedError();

  if (config.simulateEmpty && options) {
    return options.emptyValue;
  }

  return resolver();
}

/** Delay used for VM lifecycle transitions (starting/stopping → terminal). */
export const TRANSITION_DELAY_MS = 1200;

export function delayTransition(): Promise<void> {
  return delay(TRANSITION_DELAY_MS);
}
