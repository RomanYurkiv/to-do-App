import axiosInstance from "@/utils/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface LoginError {
  message: string;
}

export const loginUser = createAsyncThunk<
  string,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data.token;
  } catch (error) {
    const axiosError = error as AxiosError<LoginError>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Сталася невідома помилка"
    );
  }
});

export const registerUser = createAsyncThunk<
  string,
  RegisterCredentials,
  { rejectValue: string }
>("auth/registerUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/auth/register", credentials);
    return response.data.token;
  } catch (error) {
    const axiosError = error as AxiosError<LoginError>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Сталася невідома помилка"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Помилка входу";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Помилка реєстрації";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

