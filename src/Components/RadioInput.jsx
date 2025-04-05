const RadioInput = ({ name, id, value, checked, changeHandler, label }) => {
  return (
    <label
      htmlFor={id}
      className="inline-block m-2 px-3 py-1 rounded-full cursor-pointer shadow border-neutral-50 bg-neutral-50 text-neutral-800 hover:bg-white hover:border-white has-checked:bg-electric-violet-300 has-checked:border-electric-violet-300 dark:bg-neutral-950 dark:text-neutral-300 dark:border-neutral-950 hover:dark:bg-black hover:dark:border-black dark:has-checked:bg-electric-violet-700 dark:has-checked:border-electric-violet-700 has-checked:shadow-none has-checked:inset-shadow-sm inset-shadow-electric-violet-500 dark:inset-shadow-electric-violet-950"
    >
      <input
        type="radio"
        name={name}
        id={id}
        value={value}
        checked={checked}
        onChange={() => changeHandler()}
        className="hidden"
      />
      {label}
    </label>
  );
};

export default RadioInput;
