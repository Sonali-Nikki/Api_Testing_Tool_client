
import { useTheme } from "../context/ThemeContext.jsx";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="px-3 py-1 rounded bg-gray-700 text-white dark:bg-gray-200 dark:text-black"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export default ThemeToggle;
