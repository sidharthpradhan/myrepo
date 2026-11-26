import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export function createListSlice({ name, fetchAll, fetchOne, createItem, updateItem, removeItem }) {
  const fetchItems = createAsyncThunk(`${name}/fetchAll`, async (_, { getState }) => {
    const actor = getState().auth.user;
    return fetchAll(actor);
  });

  const fetchItem = fetchOne
    ? createAsyncThunk(`${name}/fetchOne`, async (id, { getState }) => {
        const actor = getState().auth.user;
        return fetchOne(id, actor);
      })
    : null;

  const createRecord = createItem
    ? createAsyncThunk(`${name}/create`, async (payload) => createItem(payload))
    : null;

  const updateRecord = updateItem
    ? createAsyncThunk(`${name}/update`, async ({ id, payload }) => updateItem(id, payload))
    : null;

  const removeRecord = removeItem
    ? createAsyncThunk(`${name}/remove`, async (id) => {
        await removeItem(id);
        return id;
      })
    : null;

  const slice = createSlice({
    name,
    initialState: { items: [], current: null, loading: false, saving: false, error: null },
    reducers: {
      clearCurrent(state) {
        state.current = null;
      },
      setItems(state, action) {
        state.items = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchItems.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchItems.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(fetchItems.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });

      if (fetchItem) {
        builder.addCase(fetchItem.fulfilled, (state, action) => {
          state.current = action.payload;
        });
      }
      [createRecord, updateRecord].filter(Boolean).forEach((thunk) => {
        builder
          .addCase(thunk.pending, (state) => {
            state.saving = true;
          })
          .addCase(thunk.fulfilled, (state, action) => {
            state.saving = false;
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            if (index === -1) state.items.unshift(action.payload);
            else state.items[index] = action.payload;
            state.current = action.payload;
          })
          .addCase(thunk.rejected, (state, action) => {
            state.saving = false;
            state.error = action.error.message;
          });
      });
      if (removeRecord) {
        builder.addCase(removeRecord.fulfilled, (state, action) => {
          state.items = state.items.filter((item) => item.id !== action.payload);
        });
      }
    },
  });

  return { slice, fetchItems, fetchItem, createRecord, updateRecord, removeRecord };
}
