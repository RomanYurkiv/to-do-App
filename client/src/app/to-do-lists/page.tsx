"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface TodoList {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const TodoListsPage = () => {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [newListTitle, setNewListTitle] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    const fetchTodoLists = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Вам потрібно увійти для перегляду списків');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/todo-lists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTodoLists(response.data.todoLists);
        setLoading(false);
      } catch {
        setError('Не вдалося отримати списки');
        setLoading(false);
      }
    };

    fetchTodoLists();
  }, []);

  const handleClick = (id: number) => {
    router.push(`/list/${id}`);
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Вам потрібно увійти для створення списку');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/todo-lists',
        { title: newListTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodoLists([...todoLists, response.data.list]);
      setNewListTitle('');
    } catch {
      setError('Не вдалося створити список');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-semibold mb-4">Ваші To-Do списки</h1>

      {loading && <div>Завантаження...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <form onSubmit={handleCreateList} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Назва нового списку"
            className="p-2 border rounded-md w-full"
            required
          />
          <button
            type="submit"
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Створити список
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {todoLists.map((list) => (
          <div key={list.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">{list.title}</h2>
            <p className="text-sm text-gray-500">Створено: {new Date(list.createdAt).toLocaleString()}</p>
            <p className="text-sm text-gray-500">Останнє оновлення: {new Date(list.updatedAt).toLocaleString()}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
