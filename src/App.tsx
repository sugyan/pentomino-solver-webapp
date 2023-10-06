import { useMemo, useState } from "react";
import "./App.css";
import { useAnimationFrame } from "./AnimationFrame.tsx";
import Board from "./Board.tsx";
import { Message, MessageType } from "./message.ts";

function App() {
  const [message, setMessage] = useState<string>("");
  const [solutions, setSolutions] = useState<string[][]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [running, setRunning] = useState<boolean>(true);
  const worker = useMemo(() => {
    return new Worker(new URL("./worker", import.meta.url), {
      type: "module",
    });
  }, []);
  useAnimationFrame(
    () => {
      setIndex(() => {
        if (solutions.length === 0) {
          return -1;
        } else {
          return Math.floor(Math.random() * solutions.length);
        }
      });
    },
    75,
    running
  );
  const start = () => {
    setMessage("solving...");
    setIndex(-1);
    setSolutions([]);
    worker.postMessage(null);
  };
  worker.onmessage = (event: MessageEvent) => {
    const message: Message = event.data;
    switch (message.type) {
      case MessageType.TEXT:
        setMessage(message.text);
        break;
      case MessageType.RESULTS:
        setSolutions(message.results);
        setRunning(true);
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
