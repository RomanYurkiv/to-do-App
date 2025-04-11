"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchTodoLists, createTodoList } from "../../redux/slice/todoSlice";
import { AppDispatch } from "../../redux/store";

interface TodoList {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const TodoListsPage = () => {
  const [newListTitle, setNewListTitle] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { todoLists, loading, error } = useSelector((state: { todo: { todoLists: TodoList[]; loading: boolean; error: string | null } }) => state.todo);

  useEffect(() => {
      dispatch(fetchTodoLists());
  }, [dispatch]);

  const handleClick = (id: number) => {
    router.push(`/list/${id}`);
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(createTodoList({ title: newListTitle }));
    setNewListTitle("");
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-semibold mb-4 text-[var(--foreground)]">Ваші To-Do списки</h1>

      {loading && <div>Завантаження...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <form onSubmit={handleCreateList} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Назва нового списку"
            className="p-2 border rounded-md w-full bg-[var(--input)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
            required
          />
          <button
            type="submit"
            className="ml-4 px-4 py-2 w-full bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--primary-dark)] transition duration-200 ease-in-out"
          >
            Створити список
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {todoLists.map((list: TodoList) => (
          <div key={list.id} className="bg-[var(--card)] shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">{list.title}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Створено: {new Date(list.createdAt).toLocaleString()}</p>
            <p className="text-sm text-[var(--muted-foreground)]">Останнє оновлення: {new Date(list.updatedAt).toLocaleString()}</p>
            <button
              className="mt-4 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--primary-dark)] transition duration-200 ease-in-out"
              onClick={() => handleClick(list.id)}
            >
              Переглянути завдання
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoListsPage;

