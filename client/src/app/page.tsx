"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/to-do-lists");
    } else {
      router.push("/login");
    }
  }, [router]);

  return <div>Завантаження...</div>;
};

export default HomePage;