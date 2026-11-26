import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../../constants/app";
import { authService } from "../../services/authService";

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.session);
    return raw ? JSON.parse(raw) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
}

const session = loadSession();

export const login = createAsyncThunk("auth/login", async ({ email, password }) => {
  return authService.login(email, password);
});

export const forgotPassword = createAsyncThunk("auth/forgot", async (email) => {
  return authService.forgotPassword(email);
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: session.user,
    token: session.token,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem(STORAGE_KEYS.session);
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ user: state.user, token: state.token }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token && state.auth.user);
export default authSlice.reducer;
