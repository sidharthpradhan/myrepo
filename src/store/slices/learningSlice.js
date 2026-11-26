import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { learningPathService } from "../../services/learningPathService";
import { learningService } from "../../services/learningService";

export const fetchPaths = createAsyncThunk("learning/paths", async (_, { getState }) => {
  return learningPathService.getAll(getState().auth.user);
});

export const fetchEnrollments = createAsyncThunk("learning/enrollments", async (_, { getState }) => {
  return learningService.getEnrollments(getState().auth.user);
});

export const fetchLxp = createAsyncThunk("learning/lxp", async () => learningService.getLxp());

const learningSlice = createSlice({
  name: "learning",
  initialState: {
    paths: [],
    enrollments: [],
    lxp: { bookmarks: [], favorites: [], recentlyViewed: [], goals: [], badges: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaths.fulfilled, (state, action) => {
        state.paths = action.payload;
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.enrollments = action.payload;
      })
      .addCase(fetchLxp.fulfilled, (state, action) => {
        state.lxp = action.payload;
      })
      .addMatcher(
        (action) => action.type.startsWith("learning/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith("learning/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        },
      );
  },
});

export default learningSlice.reducer;
