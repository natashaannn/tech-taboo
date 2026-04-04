// Card dimensions and layout constants
// All dimensions are in pixels unless otherwise specified

// Base card dimensions
export const CARD_DIMENSIONS_PX = {
  width: 500,
  height: 810,
  cornerRadius: 40,
  strokeWidth: 14,
} as const;

// Layout positions
export const CARD_LAYOUT_PX = {
  dividerY: CARD_DIMENSIONS_PX.height / 2, // Center divider
  textCenterX: CARD_DIMENSIONS_PX.width / 2, // Center text horizontally
} as const;

// Taboo box layout
export const TABOO_BOX_PX = {
  margin: 50,
  x: 50,
  y: 140,
  width: CARD_DIMENSIONS_PX.width - 100, // CARD_WIDTH - TABOO_BOX_MARGIN * 2
  height: 250,
  radius: 20,
  textStartY: 190, // TABOO_BOX_Y + 50
  lineSpacing: 40,
} as const;

// Pattern dimensions
export const PATTERN_DIMENSIONS_PX = {
  width: 610, // CARD_WIDTH + 110
  height: 80,
  fontSize: 28,
} as const;

// Typography
export const CARD_TYPOGRAPHY = {
  fontFamily: "Monospace, 'Sometype Mono', monospace",
  tabooTextColor: "#062E35",
  tabooFontSize: "28",
} as const;

// Print/export constants
export const CARD_PRINT_DPI = 300;
export const CARD_WEB_DPI = 96;

// Conversion helpers
export const MM_TO_PX = {
  at96: 96 / 25.4,
  at300: 300 / 25.4,
} as const;
