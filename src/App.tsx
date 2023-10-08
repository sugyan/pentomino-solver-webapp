import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import "./App.css";
import { useAnimationFrame } from "./AnimationFrame.tsx";
import CanvasBoard from "./CanvasBoard.tsx";
import Form, { Inputs } from "./Form.tsx";
import { WorkerMessage, MessageType } from "./message.ts";
import { BoardType } from "./types.ts";

function App() {
  const [message, setMessage] = useState<string>("");
  const [solutions, setSolutions] = useState<string[][]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [running, setRunning] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const formMethods = useForm<Inputs>({
    defaultValues: { board_type: BoardType.rect6x10, unique: true },
  });
  const values = formMethods.watch();
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
  const reset = () => {
    setRunning(false);
    setMessage("");
    setIndex(-1);
    setSolutions([]);
  };
  const start = () => {
    reset();
    worker.postMessage({
      type: MessageType.START,
      initial:
        values.board_type === BoardType.rect8x8_2x2
          ? BigInt(0x0000_0018_1800_0000)
          : BigInt(0),
      unique: values.unique,
    });
  };
  useEffect(() => {
    reset();
    if (initialized) {
      worker.postMessage({
        type: MessageType.SOLVER,
        board_type: values.board_type,
      });
    }
  }, [worker, initialized, values.board_type]);
  worker.onmessage = (event: MessageEvent) => {
    const message: WorkerMessage = event.data;
    switch (message.type) {
      case MessageType.INITIALIZED:
        setInitialized(true);
        break;
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
        <FormProvider {...formMethods}>
          <Form onSubmit={start} />
        </FormProvider>
        <pre id="message">{message}</pre>
      </div>
      <CanvasBoard
        boardType={values.board_type}
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
