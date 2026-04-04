// Re-export font utilities for backward compatibility
export {
  ensureEmbeddedFonts,
  getCardFontFaceCSS as getFontFaceCSS,
  createEmbeddedFontsObject,
} from "./fontUtils";
export type { FontData, EmbeddedFonts } from "./fontUtils";
