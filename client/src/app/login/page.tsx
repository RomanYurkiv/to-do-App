"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser } from "../../redux/slice/authSlice";
import { AppDispatch } from "../../redux/store";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading } = useSelector((state: { auth: { loading: boolean } }) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await dispatch(loginUser({ email, password })).unwrap();

      if (token) {
        localStorage.setItem("token", token);
        router.push("/to-do-lists");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Невідомий тип помилки");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[var(--background)]">
      <div className="bg-[var(--card)] p-8 rounded-lg shadow-xl w-full max-w-md space-y-6">
        <h1 className="text-3xl font-semibold text-center text-[var(--foreground)] mb-6">Вхід</h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--primary-foreground)]">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
              placeholder="Ваша електронна пошта"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--primary-foreground)]">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
              placeholder="Ваш пароль"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--primary-dark)] transition duration-200 ease-in-out"
            disabled={loading}
          >
            {loading ? "Завантаження..." : "Увійти"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            Ще не маєте акаунту? 
            <a href="/register" className="text-[var(--secondary-foreground)] hover:text-[var(--secondary)]">Зареєструйтесь</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;































// "use client"
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/auth/login',
//         { email, password }
//       );

//       const { token } = response.data;
//       localStorage.setItem('token', token);
//       router.push('/to-do-lists');
//     } catch {
//       setError('Невірний email або пароль');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-[var(--background)]">
//       <div className="bg-[var(--card)] p-8 rounded-lg shadow-xl w-full max-w-md space-y-6">
//         <h1 className="text-3xl font-semibold text-center text-[var(--foreground)] mb-6">Вхід</h1>
//         {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-[var(--primary-foreground)] font-medium">Email</label>
//             <input
//               type="email"
//               id="email"
//               className="w-full p-3 border border-[var(--border)] rounded-md mt-2 bg-[var(--input)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)]"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="password" className="block text-[var(--primary-foreground)] font-medium">Пароль</label>
//             <input
//               type="password"
//               id="password"
//               className="w-full p-3 border border-[var(--border)] rounded-md mt-2 bg-[var(--input)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)]"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full p-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--primary-foreground)] transition duration-200 ease-in-out"
//           >
//             Увійти
//           </button>
//         </form>

//         <div className="text-center">
//           <p className="text-sm text-[var(--muted-foreground)]">
//             Ще не маєте акаунту? 
//             <a href="/register" className="text-[var(--secondary-foreground)] hover:text-[var(--secondary)]">Зареєструйтесь</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;