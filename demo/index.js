import { render, h } from "preact";
import { useState } from "preact/hooks";
// import { debounce } from "lodash-es";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((v) => v - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount((v) => v + 1)}>+</button>
    </div>
  );
};

render(<App />, document.getElementById("root"));
