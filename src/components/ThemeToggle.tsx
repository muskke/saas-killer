"use client";

import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 w-9 h-9 flex items-center justify-center">
                <span className="w-4 h-4 bg-zinc-600 rounded-full animate-pulse"></span>
            </button>
        );
    }

    return (
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/90 dark:bg-zinc-800/80 border border-gray-300 dark:border-white/10 shadow-sm backdrop-blur-md">
            <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-full transition-all ${theme === "light"
                    ? "bg-white text-yellow-500 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    }`}
                title="Light Mode"
            >
                <Sun size={14} fill={theme === "light" ? "currentColor" : "none"} />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-full transition-all ${theme === "system"
                    ? "bg-white dark:bg-zinc-700 text-indigo-500 dark:text-indigo-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    }`}
                title="System Theme"
            >
                <Laptop size={14} />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-full transition-all ${theme === "dark"
                    ? "bg-zinc-700 text-indigo-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    }`}
                title="Dark Mode"
            >
                <Moon size={14} fill={theme === "dark" ? "currentColor" : "none"} />
            </button>
        </div>
    );
}
