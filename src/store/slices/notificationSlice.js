import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notificationService } from "../../services/notificationService";

export const fetchNotifications = createAsyncThunk("notifications/fetch", async (_, { getState }) => {
  return notificationService.getForUser(getState().auth.user);
});

export const markNotificationRead = createAsyncThunk("notifications/read", async (id) => {
  return notificationService.markRead(id);
});

export const markAllNotificationsRead = createAsyncThunk("notifications/readAll", async (_, { getState }) => {
  return notificationService.markAllRead(getState().auth.user.id);
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const selectUnreadCount = (state) => state.notifications.items.filter((item) => !item.read).length;
export default notificationSlice.reducer;
