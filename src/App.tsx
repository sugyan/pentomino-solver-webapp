import { useMemo, useState } from "react";
import "./App.css";
import { useAnimationFrame } from "./AnimationFrame.tsx";
import CanvasBoard from "./CanvasBoard.tsx";
import Form from "./Form.tsx";
import { Message, MessageType } from "./message.ts";
import { BoardType } from "./types.ts";

function App() {
  const [message, setMessage] = useState<string>("");
  const [boardType, setBoardType] = useState<BoardType>(BoardType.rect6x10);
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
    50,
    running
  );
  const start = () => {
    setMessage("solving...");
    setIndex(-1);
    setSolutions([]);
    worker.postMessage(null);
  };
  const onChange = ({ board_type }: { board_type: BoardType }) => {
    setBoardType(board_type);
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
        <Form
          defaultValues={{ board_type: boardType, unique: true }}
          onSubmit={start}
          onChangeValues={onChange}
        />
        <pre>{message}</pre>
      </div>
      <CanvasBoard
        boardType={boardType}
        solution={index >= 0 ? solutions[index] : null}
      />
      {index >= 0 && (
        <>
          <pre>
            solution #
            {index
              .toString()
              .padStart(Math.ceil(Math.log10(solutions.length)), "0")}
          </pre>
          <button onClick={() => setRunning(!running)}>
            {running ? "OK" : "Shuffle!"}
          </button>
        </>
      )}
    </>
  );
}

export default App;
