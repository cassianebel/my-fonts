const PillButton = ({ type, icon, text, disabled, clickHandler, srOnly }) => {
  return (
    <button
      type={type}
      {...(clickHandler ? { onClick: () => clickHandler() } : {})}
      disabled={disabled}
      className="w-fit flex gap-2 items-center font-bold px-4 py-2 rounded-full cursor-pointer shadow border-1 border-electric-violet-300 bg-electric-violet-300 text-neutral-900 hover:bg-electric-violet-400 hover:border-electric-violet-400 dark:bg-electric-violet-900 dark:text-neutral-100 dark:border-electric-violet-900 hover:dark:bg-electric-violet-800 hover:dark:border-electric-violet-800 transition-colors duration-300 disabled:opacity-50"
    >
      {icon && icon}
      <span className={srOnly ? "sr-only" : ""}>{text}</span>
    </button>
  );
};

export default PillButton;
