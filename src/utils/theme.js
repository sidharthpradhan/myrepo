import { DEFAULT_THEME } from "../constants/theme";

export function resolveThemeMode(mode) {
  if (mode === "light" || mode === "dark") return mode;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme({ mode = DEFAULT_THEME.mode, primaryColor = DEFAULT_THEME.primaryColor }) {
  const resolved = resolveThemeMode(mode);
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.style.setProperty("--app-primary", primaryColor);
}
