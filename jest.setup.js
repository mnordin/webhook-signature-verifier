import "@testing-library/jest-dom";

// 1. Assign native Node 25 Fetch API globals
// We use globalThis to ensure we pull from the Node environment
// and assign to the Jest global context.
global.Request = globalThis.Request;
global.Response = globalThis.Response;
global.Headers = globalThis.Headers;

// 2. Mock the NextResponse constructor and methods
global.NextResponse = class NextResponse {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this._bodyText = typeof body === "string" ? body : JSON.stringify(body);
    this._headers = new Headers(options.headers || {});
  }

  text() {
    return Promise.resolve(this._bodyText);
  }

  json() {
    return Promise.resolve(JSON.parse(this._bodyText));
  }
};

// 3. Mock the global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ signature: "mocked-signature" }),
    text: () => Promise.resolve("Mocked response"),
    status: 200,
  }),
);

// 4. Mock clipboard API
if (
  typeof navigator !== "undefined" &&
  typeof navigator.clipboard === "undefined"
) {
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: jest.fn(),
    },
    writable: true,
  });
}

// 5. Mock the window object
if (typeof window !== "undefined") {
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
}

// 6. Suppress certain console methods during tests
const originalConsoleError = console.error;
console.error = jest.fn((...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("next-dev.js") ||
      args[0].includes("React does not recognize"))
  ) {
    return;
  }
  return originalConsoleError(...args);
});
