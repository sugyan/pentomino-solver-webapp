import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Board from "./Board.tsx";
import { Message, MessageType } from "./message.ts";

function App() {
  const [message, setMessage] = useState<string>("");
  const [solutions, setSolutions] = useState<string[][]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [running, setRunning] = useState<boolean>(true);
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
    const message: Message = event.data;
    switch (message.type) {
      case MessageType.TEXT:
        setMessage(message.text);
        break;
      case MessageType.RESULTS:
        setSolutions(message.results);
        break;
      default:
        break;
    }
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

export default App;
