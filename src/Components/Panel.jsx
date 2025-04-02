import React from "react";

const Panel = ({ heading, children }) => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-neutral-200 dark:bg-neutral-800 dark:border-1 dark:border-neutral-600">
      {heading && <h2 className="font-black mb-2 text-lg">{heading}</h2>}
      {children}
    </div>
  );
};

export default Panel;
