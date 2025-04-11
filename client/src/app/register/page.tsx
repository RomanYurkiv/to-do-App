"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { registerUser } from "@/redux/slice/authSlice";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";

const RegisterPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    if (!email || !password || !name) {
      setError("Будь ласка, заповніть всі поля.");
      setLoading(false);
      return;
    }

    try {
      const token = await dispatch(registerUser({ name, email, password })).unwrap();

      localStorage.setItem('token', token);
      router.push('/to-do-lists');

    } catch (err) {
      console.error("Registration error:", err);
      setError("Не вдалося зареєструватися. Спробуйте ще раз.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">Реєстрація</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--primary-foreground)]">
              Імя
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
              placeholder="Ваше ім'я"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--primary-foreground)]">
              Електронна пошта
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
              placeholder="Ваша електронна пошта"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--primary-foreground)]">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
              placeholder="Ваш пароль"
            />
          </div>

          <button
            type="button"
            onClick={handleRegister}
            className="w-full mt-4 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold rounded-md shadow-sm hover:bg-[var(--primary-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Реєстрація..." : "Зареєструватися"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
