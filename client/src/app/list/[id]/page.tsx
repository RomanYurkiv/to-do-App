"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'next/navigation';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;  
  createdAt: string;
  updatedAt: string;
}

interface TodoList {
  id: number;
  title: string;
  tasks: Task[];
}

const ListPage = () => {
  const [todoList, setTodoList] = useState<TodoList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (params) {
      const fetchTodoList = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("Вам потрібно увійти для перегляду списку");
            setLoading(false);
            return;
          }

          const response = await axios.get(
            `http://localhost:5000/todo-lists/${params.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setTodoList(response.data);
          setLoading(false);
        } catch  {
          setError("Не вдалося отримати список");
          setLoading(false);
        }
      };

      fetchTodoList();
    }
  }, [params.id]);

  const handleAddTask = async () => {
    if (!newTaskTitle || !newTaskDescription) {
      setError("Будь ласка, заповніть всі поля.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Вам потрібно увійти для додавання завдання");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/todo-lists/${params.id}/tasks`,
        {
          title: newTaskTitle,
          description: newTaskDescription,
          status: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodoList((prevTodoList) => {
        if (prevTodoList) {
          return {
            ...prevTodoList,
            tasks: [...prevTodoList.tasks, response.data.task],
          };
        }
        return prevTodoList;
      });

      setNewTaskTitle("");
      setNewTaskDescription("");
    } catch {
      setError("Не вдалося додати завдання.");
    }
  };

  const handleUpdateStatus = async ({ id, ...rest}: Task) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Вам потрібно увійти для зміни статусу завдання");
        return;
      }

      await axios.put(
        `http://localhost:5000/todo-lists/${params.id}/tasks/${id}`,
        {
          ...rest,
          status: "completed",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodoList((prevTodoList) => {
        if (prevTodoList) {
          const updatedTasks = prevTodoList.tasks.map((task) =>
            task.id === id ? { ...task, status: "completed" } : task
          );
          return { ...prevTodoList, tasks: updatedTasks };
        }
        return prevTodoList;
      });
    } catch {
      setError("Не вдалося змінити статус завдання.");
    }
  };

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-semibold mb-4">{todoList?.title}</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Додати нове завдання</h2>
        <input
          type="text"
          placeholder="Назва завдання"
          className="border p-2 w-full mb-4"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <textarea
          placeholder="Опис завдання"
          className="border p-2 w-full mb-4"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Додати завдання
        </button>
      </div>

      <div className="space-y-4">
        {todoList?.tasks.length === 0 ? (
          <p>У цьому списку немає завдань.</p>
        ) : (
          todoList?.tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white shadow-md rounded-lg p-4 border border-gray-200 ${
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

              <p className={`text-sm font-semibold ${task.status === "completed" ? "text-green-500" : "text-yellow-500"}`}>
                {task.status === "completed" ? "Виконано" : "В очікуванні"}
              </p>

              {task.status !== "completed" && (
                <button
                  onClick={() => handleUpdateStatus(task)}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                >
                  Зробити виконаним
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListPage;
