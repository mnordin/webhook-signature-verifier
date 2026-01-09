import { render } from "@testing-library/react";
import Home from "../app/page";

// Mock next/navigation (required for "use client" directive)
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock the fetch API that's used in the component
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ signature: "test-signature" }),
    text: () => Promise.resolve("Success"),
    status: 200,
  }),
);

// Mock the clipboard API
if (typeof navigator.clipboard === "undefined") {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: jest.fn() },
    writable: true,
  });
}

describe("Page", () => {
  it("renders without crashing", () => {
    // Suppress console errors for this test to focus on rendering
    const originalConsole = console.error;
    console.error = jest.fn();

    try {
      const { container } = render(<Home />);

      expect(container).toBeTruthy();
    } finally {
      console.error = originalConsole;
    }
  });
});
