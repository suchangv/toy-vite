import React from "react";
import ReactDOM from "react-dom";
import { debounce } from "lodash-es";

const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <button onClick={() => setCount((v) => v - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount((v) => v + 1)}>+</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
