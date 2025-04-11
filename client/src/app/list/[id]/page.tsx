"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { fetchTasks, addTask, updateTaskStatus, deleteTask } from "../../../redux/slice/taskSlice";
import { RootState, AppDispatch } from "../../../redux/store";

const ListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { tasks, loading, error: tasksError } = useSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
    const fetchTodoList = async () => {
      try {
        dispatch(fetchTasks(id));
      } catch {
        setError("Не вдалося отримати завдання");
      }
    };

    fetchTodoList();
  }, [dispatch, id]);

  const handleAddTask = () => {
    if (!newTaskTitle || !newTaskDescription) {
      setError("Будь ласка, заповніть всі поля.");
      return;
    }

    dispatch(addTask({ listId: id!, title: newTaskTitle, description: newTaskDescription }));
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleUpdateStatus = (taskId: number) => {
    dispatch(updateTaskStatus({ listId: id!, taskId, status: "completed"}));
  };

  const handleDeleteTask = (taskId: number) => {
    dispatch(deleteTask({ listId: id!, taskId }));
  };

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (tasksError) {
    return <div className="text-red-500">{tasksError}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-semibold mb-4">{`Список задач ${id}`}</h1>

      {error && <div className="text-red-500">{error}</div>}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Додати нове завдання</h2>
        <input
          type="text"
          placeholder="Назва завдання"
          className="p-3 border border-[var(--border)] rounded-md w-full mb-4 bg-[var(--input)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)]"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <textarea
          placeholder="Опис завдання"
          className="p-3 border border-[var(--border)] rounded-md w-full mb-4 bg-[var(--input)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)]"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--primary-foreground)] transition duration-200 ease-in-out"
        >
          Додати завдання
        </button>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p>У цьому списку немає завдань.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white shadow-md rounded-lg p-4 border border-[var(--border)] ${
                task.status === "completed" ? "bg-green-100" : "bg-white"
              }`}
            >
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-sm text-gray-500">{task.description}</p>
              <p className="text-sm text-gray-500">
                Створено: {new Date(task.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Останнє оновлення: {new Date(task.updatedAt).toLocaleString()}
              </p>

              <p
                className={`text-sm font-semibold ${
                  task.status === "completed" ? "text-green-500" : "text-yellow-500"
                }`}
              >
                {task.status === "completed" ? "Виконано" : "В очікуванні"}
              </p>

              {task.status !== "completed" && (
                <button
                  onClick={() => handleUpdateStatus(task.id)}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 ease-in-out"
                >
                  Зробити виконаним
                </button>
              )}

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 ease-in-out"
              >
                Видалити
              </button>

              <button
                onClick={() => handleEditTask(task.id, "New Title", "New Description")}
                className="mt-4 ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ease-in-out"
              >
                Редагувати
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListPage;

