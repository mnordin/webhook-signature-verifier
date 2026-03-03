// Mock next/navigation (required for "use client" directive)
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe("Page", () => {
  it("exports a default component", () => {
    // The component can be imported without errors
    const Home = require("../app/page").default;

    expect(Home).toBeDefined();
    expect(typeof Home).toBe("function");
  });
});
