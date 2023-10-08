import init, { WasmSolver } from "./lib/pentomino_solver_wasm";
import { MainMessage, MessageType } from "./message.ts";
import { BoardSize, BoardType } from "./types.ts";

class Worker {
  solver: WasmSolver | null = null;
  initializing: boolean = false;
  messages: MainMessage[] = [];
  handleMessage(message: MainMessage) {
    switch (message.type) {
      case MessageType.SOLVER:
        this.prepareSolver(message.board_type);
        break;
      case MessageType.START:
        this.start(message.initial, message.unique);
        break;
      default:
        break;
    }
  }
  private prepareSolver(boardType: BoardType) {
    // TODO: handle multiple solver requests
    const size = BoardSize[boardType];
    if (this.solver) {
      this.solver.free();
    }
    this.solver = WasmSolver.new(size.height, size.width, false);
  }
  private start(initial: bigint, unique: boolean) {
    if (!this.solver) {
      return;
    }
    const now = performance.now();
    const solutions = this.solver.solve(initial, unique);
    const elapsed = performance.now() - now;
    const results = this.solver.represent_solution(solutions);
    self.postMessage({
      type: MessageType.TEXT,
      text: `Found ${results.length} solutions in ${elapsed.toFixed(3)} ms`,
    });
    self.postMessage({
      type: MessageType.RESULTS,
      results,
    });
  }
}

const worker = new Worker();
(async () => {
  await init();
  self.addEventListener("message", (event: MessageEvent) => {
    worker.handleMessage(event.data);
  });
  self.postMessage({ type: MessageType.INITIALIZED });
})();
