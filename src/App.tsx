import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAnimationFrame } from "./AnimationFrame.tsx";
import CanvasBoard from "./CanvasBoard.tsx";
import Form, { Inputs } from "./Form.tsx";
import { WorkerMessage, MessageType } from "./message.ts";
import { BoardType, SolverType } from "./types.ts";

function App() {
  const [message, setMessage] = useState<string>("");
  const [solutions, setSolutions] = useState<string[][]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [animating, setAnimating] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const formMethods = useForm<Inputs>({
    defaultValues: {
      solver_type: SolverType.Light,
      board_type: BoardType.Rect6x10,
      unique: true,
    },
  });
  const values = formMethods.watch();
  const worker = useMemo(() => {
    return new Worker(new URL("./worker", import.meta.url), {
      type: "module",
    });
  }, []);
  const reset = () => {
    setAnimating(false);
    setIndex(-1);
    setSolutions([]);
  };
  const start = () => {
    reset();
    worker.postMessage({
      type: MessageType.START,
      initial:
        values.board_type === BoardType.Rect8x8_2x2
          ? BigInt(0x0000_0018_1800_0000)
          : BigInt(0),
      unique: values.unique,
    });
  };
  const updateIndex = (value: number) => {
    if (solutions.length === 0) {
      return -1;
    }
    setIndex((value + solutions.length) % solutions.length);
  };
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
    0,
    animating
  );
  useEffect(() => {
    reset();
    if (initialized) {
      worker.postMessage({
        type: MessageType.SOLVER,
        solver_type: values.solver_type,
        board_type: values.board_type,
      });
    }
  }, [worker, initialized, values.solver_type, values.board_type]);
  worker.onmessage = (event: MessageEvent) => {
    const messages: WorkerMessage = event.data;
    messages.forEach((message) => {
      switch (message.type) {
        case MessageType.INITIALIZED:
          setInitialized(true);
          break;
        case MessageType.STATE:
          setIsReady(message.is_ready);
          break;
        case MessageType.TEXT:
          setMessage(message.text);
          break;
        case MessageType.RESULTS:
          setSolutions(message.results);
          setAnimating(true);
          setTimeout(() => {
            setAnimating(false);
          }, 300);
          break;
        default:
          break;
      }
    });
  };
  return (
    <div className="bg-gray-800 text-gray-200 min-h-screen">
      <div className="max-w-screen-lg mx-auto py-4 flex flex-col items-center">
        <h1 className="font-mono text-2xl mb-2">Pentomino Solver</h1>
        <FormProvider {...formMethods}>
          <Form onSubmit={start} isReady={isReady} />
        </FormProvider>
        <pre className="mx-2 my-4 text-sm text-gray-300">{message}</pre>
        <CanvasBoard
          boardType={values.board_type}
          solution={index >= 0 ? solutions[index] : null}
        />
        {index >= 0 && (
          <div className="flex items-center text-sm font-mono">
            <button
              onClick={() => updateIndex(index - 1)}
              className="text-gray-200 px-2 py-1"
            >
              &lt;
            </button>
            <div>
              solution #
              <input
                type="number"
                value={index
                  .toString()
                  .padStart(Math.ceil(Math.log10(solutions.length)), "0")}
                onChange={(event) => updateIndex(parseInt(event.target.value))}
                className="bg-gray-800 text-gray-200 w-12"
              />
            </div>
            <button
              onClick={() => updateIndex(index + 1)}
              className="text-gray-200 px-2 py-1"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
