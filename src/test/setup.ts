import "@testing-library/jest-dom/vitest";

// jsdom does not implement scrolling: avoid noisy "not implemented" errors.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
