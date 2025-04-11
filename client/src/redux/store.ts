import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./slice/todoSlice";
import authReducer from "./slice/authSlice";
import taskReducer from "./slice/taskSlice";



export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      todo: todoReducer,
      tasks: taskReducer,
    },
  })
}

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
