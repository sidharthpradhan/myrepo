import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../../constants/app";
import { DEFAULT_THEME } from "../../constants/theme";
import { applyTheme } from "../../utils/theme";

function loadTheme() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.theme);
    return raw ? { ...DEFAULT_THEME, ...JSON.parse(raw) } : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

const initialState = loadTheme();
if (typeof document !== "undefined") applyTheme(initialState);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode(state, action) {
      state.mode = action.payload;
      localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(state));
      applyTheme(state);
    },
    setPrimaryColor(state, action) {
      state.primaryColor = action.payload;
      localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(state));
      applyTheme(state);
    },
  },
});

export const { setThemeMode, setPrimaryColor } = themeSlice.actions;
export const selectTheme = (state) => state.theme;
export default themeSlice.reducer;
