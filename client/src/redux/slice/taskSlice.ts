import axiosInstance from "@/utils/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

type TaskStatus = "pending" | "completed"

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

interface TaskError {
  message: string;
}

export const fetchTasks = createAsyncThunk<Task[], string, { rejectValue: string }>(
  "tasks/fetchTasks",
  async (listId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/todo-lists/${listId}`);
      return response.data.tasks;
    } catch (error) {
      const axiosError = error as AxiosError<TaskError>;
      return rejectWithValue(axiosError.response?.data?.message || "Не вдалося отримати завдання");
    }
  }
);

export const addTask = createAsyncThunk<Task, { listId: string; title: string; description: string }, { rejectValue: string }>(
  "tasks/addTask",
  async ({ listId, title, description }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/todo-lists/${listId}/tasks`, { title, description, status:'pending' });
      return response.data.task;
    } catch (error) {
      const axiosError = error as AxiosError<TaskError>;
      return rejectWithValue(axiosError.response?.data?.message || "Не вдалося додати завдання");
    }
  }
);



export const updateTaskStatus = createAsyncThunk<Task, { listId: string; taskId: number , status: TaskStatus }, { rejectValue: string }>(
  "tasks/updateTaskStatus",
  async ({ listId, taskId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/todo-lists/${listId}/tasks/${taskId}/status`, {status});
      return response.data.task;
    } catch (error) {
      const axiosError = error as AxiosError<TaskError>;
      return rejectWithValue(axiosError.response?.data?.message || "Не вдалося оновити статус завдання");
    }
  }
);

export const deleteTask = createAsyncThunk<{ taskId: number }, { listId: string; taskId: number }, { rejectValue: string }>(
  "tasks/deleteTask",
  async ({ listId, taskId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/todo-lists/${listId}/tasks/${taskId}`);
      return { taskId };
    } catch (error) {
      const axiosError = error as AxiosError<TaskError>;
      return rejectWithValue(axiosError.response?.data?.message || "Не вдалося видалити завдання");
    }
  }
);

export const editTask = createAsyncThunk<Task, { taskId: number; title: string; description: string }, { rejectValue: string }>(
  "tasks/editTask",
  async ({ taskId, title, description }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/todo-lists/tasks/${taskId}`, { title, description  });
      return response.data.task;
    } catch (error) {
      const axiosError = error as AxiosError<TaskError>;
      return rejectWithValue(axiosError.response?.data?.message || "Не вдалося оновити завдання");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(addTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
      state.loading = false;
      state.error = null;
    });
    builder.addCase(addTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateTaskStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTaskStatus.fulfilled, (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateTaskStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(deleteTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.taskId);
      state.loading = false;
      state.error = null;
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(editTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editTask.fulfilled, (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
      state.loading = false;
      state.error = null;
    });
    builder.addCase(editTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default taskSlice.reducer;
