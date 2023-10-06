import init, { WasmSolver } from "./lib/pentomino_solver_wasm";
import { Message, MessageType } from "./message.ts";

(async () => {
  await init();

  self.addEventListener("message", () => {
    const solverNow = performance.now();
    const solver = WasmSolver.new(6, 10, false);
    const solverElapsed = performance.now() - solverNow;
    const solverInitializedMessage: Message = {
      type: MessageType.TEXT,
      text: `Initialized solver in ${solverElapsed.toFixed(3)} ms`,
    };
    self.postMessage(solverInitializedMessage);

    const now = performance.now();
    const solutions = solver.solve(BigInt(0), true);
    const elapsed = performance.now() - now;
    const results = solver.represent_solution(solutions);
    const textMessage: Message = {
      type: MessageType.TEXT,
      text: `Found ${results.length} solutions in ${elapsed.toFixed(3)} ms`,
    };
    self.postMessage(textMessage);
    const resultMessage: Message = {
      type: MessageType.RESULTS,
      results,
    };
    self.postMessage(resultMessage);
    solver.free();
  });
})();
