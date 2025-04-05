const SelectMenu = ({ label, name, id, value, handleChange, options }) => {
  return (
    <div className="flex gap-2 items-center">
      <label htmlFor={name} className="font-extralight">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="px-4 py-2 rounded-md shadow cursor-pointer border-1 border-neutral-300 bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700 dark:text-neutral-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectMenu;
