import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [solutions, setSolutions] = useState([]);
  const [index, setIndex] = useState(-1);
  const [running, setRunning] = useState(true);
  const reqId = useRef<number | null>(null);
  const timeoutId = useRef<number | null>(null);
  const worker = useMemo(() => {
    return new Worker(new URL("./worker", import.meta.url), {
      type: "module",
    });
  }, []);
  const start = () => {
    setMessage("solving...");
    setIndex(-1);
    setSolutions([]);
    worker.postMessage(null);
  };
  useEffect(() => {
    const loop = () => {
      setIndex(() => {
        if (solutions.length === 0) {
          return -1;
        } else {
          return Math.floor(Math.random() * solutions.length);
        }
      });
      if (running) {
        reqId.current = requestAnimationFrame(() => {
          timeoutId.current = setTimeout(loop, 30);
        });
      }
    };
    reqId.current = requestAnimationFrame(loop);
    return () => {
      if (reqId.current !== null) {
        cancelAnimationFrame(reqId.current);
      }
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [running, solutions]);
  worker.onmessage = (event: MessageEvent) => {
    setMessage(
      `Found ${
        event.data.results.length
      } solutions in ${event.data.elapsed.toFixed(3)}ms`
    );
    setSolutions(event.data.results);
    setRunning(true);
  };
  return (
    <>
      <h3>Pentomino Solver</h3>
      <div className="card">
        <button onClick={start}>solve</button>
        <pre>{message}</pre>
      </div>
      {index >= 0 && (
        <div onClick={() => setRunning(!running)}>
          <Board solution={solutions[index]} />
          <pre>solution #{index.toString().padStart(4, "0")}</pre>
        </div>
      )}
    </>
  );
}

function Cell({ type }: { type: string }) {
  const color = {
    O: "red",
    P: "green",
    Q: "blue",
    R: "yellow",
    S: "purple",
    T: "orange",
    U: "pink",
    V: "cyan",
    W: "lime",
    X: "brown",
    Y: "magenta",
    Z: "teal",
  }[type];
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        backgroundColor: color || "white",
        border: "1px solid black",
      }}
    ></div>
  );
}

function Board({ solution }: { solution: string[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 40px)" }}>
      {solution.map((row, rowIndex) =>
        row
          .split("")
          .map((cellType, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cellType} />
          ))
      )}
    </div>
  );
}

export default App;
