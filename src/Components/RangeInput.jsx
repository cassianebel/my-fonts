const RangeInput = ({ name, id, min, max, value, handleChange }) => {
  return (
    <div className="flex gap-2">
      <label htmlFor={name} className="font-extralight">
        Size
      </label>
      <input
        type="range"
        min={min}
        max={max}
        id={id}
        name={name}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="accent-electric-violet-400 dark:accent-electric-violet-700"
      />
      <p>{value}</p>
    </div>
  );
};

export default RangeInput;
