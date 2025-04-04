import { IoInvertMode } from "react-icons/io5";

const ThemeButton = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };
  return (
    <button
      onClick={toggleTheme}
      className="p-2 flex items-center gap-2 cursor-pointer "
    >
      <IoInvertMode className="text-2xl text-black dark:text-white" />
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
};

export default ThemeButton;
