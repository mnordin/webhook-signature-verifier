import "@testing-library/jest-dom";

// Set up the required global objects for Next.js tests
if (typeof global.Request === "undefined") {
  global.Request = globalThis.Request || require("node-fetch").Request;
  global.Response = globalThis.Response || require("node-fetch").Response;
  global.Headers = globalThis.Headers || require("node-fetch").Headers;
}

// Mock the NextResponse constructor and methods
global.NextResponse = class NextResponse {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this._bodyText = body;
    this._headers = new Headers(options.headers || {});
  }

  text() {
    return Promise.resolve(this._bodyText);
  }

  json() {
    return Promise.resolve(JSON.parse(this._bodyText));
  }
};

// Mock the global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ signature: "mocked-signature" }),
    text: () => Promise.resolve("Mocked response"),
    status: 200,
  }),
);

// Mock clipboard API
if (typeof navigator.clipboard === "undefined") {
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: jest.fn(),
    },
    writable: true,
  });
}

// Mock the window object
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress certain console methods during tests
const originalConsoleError = console.error;
console.error = jest.fn((...args) => {
  // Filter out Next.js specific warnings that we don't care about in tests
  if (
    typeof args[0] === "string" &&
    (args[0].includes("next-dev.js") ||
      args[0].includes("React does not recognize"))
  ) {
    return;
  }
  return originalConsoleError(...args);
});
