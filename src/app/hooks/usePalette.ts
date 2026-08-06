import { useTheme } from "next-themes";

export const darkPalette = {
  pageBg: "#050a0e",
  sectionAlt: "#060d12",
  sectionMid: "#0a1a22",
  cardBg: "#0a1a14",
  inputBg: "#0f2018",
  accent: "#00e676",
  accentDim: "rgba(0,230,118,0.12)",
  accentBorder: "rgba(0,230,118,0.15)",
  accentBorderStrong: "rgba(0,230,118,0.35)",
  heading: "#ffffff",
  body: "#a0c4b8",
  muted: "#6b9e8a",
  faint: "#4a7a62",
  heroGrad: "linear-gradient(135deg, #060d12, #0a1a22, #050a0e)",
  text: "white",
};

export const lightPalette = {
  pageBg: "#f0f4f8",
  sectionAlt: "#e8f5ee",
  sectionMid: "#d4eae0",
  cardBg: "#e8f3ed",
  inputBg: "#f0f7f3",
  accent: "#00804a",
  accentDim: "rgba(0,128,74,0.10)",
  accentBorder: "rgba(0,128,74,0.18)",
  accentBorderStrong: "rgba(0,128,74,0.40)",
  heading: "#0d2b1a",
  body: "#2d6b52",
  muted: "#3d7a5e",
  faint: "#527a65",
  heroGrad: "linear-gradient(135deg, #e8f5ee, #d4eae0, #f0f4f8)",
  text: "#0d2b1a",
};

export function usePalette() {
  const { theme } = useTheme();
  return theme === "dark" ? darkPalette : lightPalette;
}
