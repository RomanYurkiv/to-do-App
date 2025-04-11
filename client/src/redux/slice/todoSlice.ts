

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

interface TodoList {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoState {
  todoLists: TodoList[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todoLists: [],
  loading: false,
  error: null,
};

export const fetchTodoLists = createAsyncThunk(
  "todo/fetchTodoLists",
  async () => {
    const response = await axiosInstance.get("/todo-lists");
    return response.data.todoLists;
  }
);

export const createTodoList = createAsyncThunk(
  "todo/createTodoList",
  async ({ title }: { title: string;}) => {
    const response = await axiosInstance.post(
      "/todo-lists",
      { title },
    );
    return response.data.list;
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodoLists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodoLists.fulfilled, (state, action) => {
        state.loading = false;
        state.todoLists = action.payload;
      })
      .addCase(fetchTodoLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch todo lists";
      })
      .addCase(createTodoList.fulfilled, (state, action) => {
        state.todoLists.push(action.payload);
      })
      .addCase(createTodoList.rejected, (state) => {
        state.error = "Failed to create todo list";
      });
  },
});

export default todoSlice.reducer;
