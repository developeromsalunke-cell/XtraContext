"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-800 transition-colors group border border-transparent hover:border-gray-700"
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded border border-gray-700 bg-gray-900 group-hover:border-white transition-all">
          <span className="text-xs">{theme === "dark" ? "🌑" : "☀️"}</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">
          {theme === "dark" ? "Noir Mode" : "Swiss Mode"}
        </span>
      </div>
      <div className={`w-6 h-3 rounded-full border border-gray-700 relative transition-all ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
         <div className={`absolute top-0.5 w-1.5 h-1.5 rounded-full transition-all ${theme === 'light' ? 'right-0.5 bg-black' : 'left-0.5 bg-white'}`} />
      </div>
    </button>
  );
}
