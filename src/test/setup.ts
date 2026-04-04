import "@testing-library/jest-dom";

// Mock SVG object element
Object.defineProperty(HTMLObjectElement.prototype, "getSVGDocument", {
  value: () => null,
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock fetch for font and image files
const originalFetch = global.fetch;
global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input.toString();

  // Mock font and image file responses
  if (url.includes("/assets/fonts/") || url.includes("/assets/techybara/")) {
    // Create a mock response that returns a Promise<Blob>
    const mockBase64 = "AAAA"; // Minimal mock data
    const mockBlob = new Blob([mockBase64], {
      type: "application/octet-stream",
    });

    // Mock the Response object with a working blob() method
    const mockResponse = {
      ok: true,
      status: 200,
      headers: new Headers({ "Content-Type": "application/octet-stream" }),
      blob: async () => mockBlob,
      text: async () => mockBase64,
      json: async () => ({}),
      arrayBuffer: async () => new ArrayBuffer(0),
    } as Response;

    return mockResponse;
  }

  // For all other requests, use the original fetch
  return originalFetch(input, init);
};
