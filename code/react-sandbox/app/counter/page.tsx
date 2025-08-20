"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Nik");
  const [count2, setCount2] = useState(0);

  //Whenever the new state depends on the previous one, use the function form:
const spamClick = () => {
  for (let i = 0; i < 5; i++) setCount2(c => c + 1);
};


  console.log("🔄 render");   // <-- watch me

  const handleClick = () => {
    setCount(c => c + 1);
    setName(n => n + "!");
  };

  return (
    <>
    <button onClick={handleClick}>
      {name}: {count}
    </button>
    <br />
    <button onClick={spamClick}>
        {count2}
    </button>
    </>
  );
}
/* 
This is an example to show react 18 automatic batching.
React 18 introduced automatic batching: updates triggered during the same event loop tick 
(like inside one click handler) are grouped so React reconciles only once. 
But there are caveats (e.g., async tasks).

Key idea: All state updates triggered during the same synchronous task are batched into a single render.



*/