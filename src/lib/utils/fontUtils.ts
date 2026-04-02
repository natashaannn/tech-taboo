// Shared font utilities for card generation and packaging

export interface FontData {
  gaegu?: string;
  mono?: string;
  monoBold?: string;
  sometypeMono?: string;
}

export interface EmbeddedFonts {
  monospaceNormal: string;
  monospaceBold: string;
  monospaceOblique: string;
  sometypeMonoNormal: string;
  sometypeMonoItalic: string;
}

// Font cache for embedded fonts
const FONT_DATA_CACHE: FontData = {
  gaegu: undefined,
  mono: undefined,
  monoBold: undefined,
  sometypeMono: undefined,
};

// Techybara image cache
const TECHYBARA_IMAGE_CACHE = {
  teacher: null as string | null,
  peekOut: null as string | null,
};

// Resolve asset URLs for both development and production
export function resolveAssetUrl(path: string): string {
  if (typeof window === "undefined" || !window.location) return path;
  try {
    return new URL(path, window.location.href).href;
  } catch (_) {
    return path;
  }
}

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function fetchImageAsDataUri(path: string): Promise<string> {
  const absoluteUrl = resolveAssetUrl(path);
  const response = await fetch(absoluteUrl, { cache: "force-cache" });
  if (!response.ok) throw new Error(`Failed to fetch asset: ${absoluteUrl}`);
  const blob = await response.blob();
  return blobToDataUri(blob);
}

export async function ensureEmbeddedTechybaraImages() {
  if (!TECHYBARA_IMAGE_CACHE.teacher) {
    TECHYBARA_IMAGE_CACHE.teacher = await fetchImageAsDataUri(
      "/assets/techybara/teacher.png",
    );
  }
  if (!TECHYBARA_IMAGE_CACHE.peekOut) {
    TECHYBARA_IMAGE_CACHE.peekOut = await fetchImageAsDataUri(
      "/assets/techybara/peek out.png",
    );
  }
  return TECHYBARA_IMAGE_CACHE;
}

export async function ensureEmbeddedFonts(): Promise<FontData> {
  if (!FONT_DATA_CACHE.gaegu) {
    FONT_DATA_CACHE.gaegu = await fetchImageAsDataUri(
      "/assets/fonts/Gaegu/Gaegu-Bold.ttf",
    );
  }
  if (!FONT_DATA_CACHE.mono) {
    FONT_DATA_CACHE.mono = await fetchImageAsDataUri(
      "/assets/fonts/monospace/Monospace.ttf",
    );
  }
  if (!FONT_DATA_CACHE.monoBold) {
    FONT_DATA_CACHE.monoBold = await fetchImageAsDataUri(
      "/assets/fonts/monospace/MonospaceBold.ttf",
    );
  }
  return FONT_DATA_CACHE;
}

export async function ensurePackagingFonts(): Promise<FontData> {
  return ensureEmbeddedFonts();
}

export async function loadFontAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load font: ${url}`);
  const buffer = await response.arrayBuffer();

  // Convert ArrayBuffer to base64 in chunks to avoid stack overflow
  const chunkSize = 0x8000; // 32KB chunks
  const chunks: string[] = [];
  let i = 0;

  for (i = 0; i < buffer.byteLength; i += chunkSize) {
    const chunk = buffer.slice(i, i + chunkSize);
    chunks.push(
      String.fromCharCode.apply(null, Array.from(new Uint8Array(chunk))),
    );
  }

  return btoa(chunks.join(""));
}

export function getCardFontFaceCSS(fonts: EmbeddedFonts): string {
  return `
    @font-face {
      font-family: 'Monospace';
      src: url('data:font/truetype;base64,${fonts.monospaceNormal}') format('truetype');
      font-style: normal;
      font-weight: 400;
    }
    @font-face {
      font-family: 'Monospace';
      src: url('data:font/truetype;base64,${fonts.monospaceBold}') format('truetype');
      font-style: normal;
      font-weight: 700;
    }
    @font-face {
      font-family: 'Sometype Mono';
      src: url('data:font/woff2;base64,${fonts.sometypeMonoNormal}') format('woff2');
      font-style: normal;
      font-weight: 400;
    }
    @font-face {
      font-family: 'Sometype Mono';
      src: url('data:font/woff2;base64,${fonts.sometypeMonoItalic}') format('woff2');
      font-style: italic;
      font-weight: 400;
    }
  `;
}

export function getPackagingFontFaceCSS(fonts: FontData): string {
  return `
    @font-face {
      font-family: 'Gaegu';
      src: url('${fonts.gaegu || resolveAssetUrl("/assets/fonts/Gaegu/Gaegu-Bold.ttf")}') format('truetype');
      font-style: normal;
      font-weight: 700;
    }
    @font-face {
      font-family: 'Monospace';
      src: url('${fonts.mono || resolveAssetUrl("/assets/fonts/monospace/Monospace.ttf")}') format('truetype');
      font-style: normal;
      font-weight: 400;
    }
    @font-face {
      font-family: 'Monospace';
      src: url('${fonts.monoBold || fonts.mono || resolveAssetUrl("/assets/fonts/monospace/MonospaceBold.ttf")}') format('truetype');
      font-style: normal;
      font-weight: 700;
    }
  `;
}

export function createEmbeddedFontsObject(fonts: FontData): EmbeddedFonts {
  return {
    monospaceNormal: fonts.mono || "",
    monospaceBold: fonts.monoBold || fonts.mono || "",
    monospaceOblique: "",
    sometypeMonoNormal: fonts.sometypeMono || "",
    sometypeMonoItalic: "",
  };
}
