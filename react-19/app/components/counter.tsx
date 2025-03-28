import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="text-black flex gap-4 items-center">
      <button
        className="py-1 px-2 text-white bg-cyan-700 rounded"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
      <span>Count: {count}</span>
    </div>
  );
};
