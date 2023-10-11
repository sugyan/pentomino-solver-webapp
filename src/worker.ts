import init, { WasmSolver } from "./lib/pentomino_solver_wasm";
import { MainMessage, MessageType } from "./message.ts";
import { BoardSize, BoardType, SolverType } from "./types.ts";

class Worker {
  solver: WasmSolver | null = null;
  initializing: boolean = false;
  messages: MainMessage[] = [];
  handleMessage(message: MainMessage) {
    switch (message.type) {
      case MessageType.SOLVER:
        this.prepareSolver(message.solver_type, message.board_type);
        break;
      case MessageType.START:
        this.start(message.initial, message.unique);
        break;
      default:
        break;
    }
  }
  private prepareSolver(solverType: SolverType, boardType: BoardType) {
    const boardName = boardType.split(" ")[0];
    self.postMessage([
      {
        type: MessageType.STATE,
        is_ready: false,
      },
      {
        type: MessageType.TEXT,
        text: `Preparing ${solverType} solver for ${boardName}...`,
      },
    ]);
    if (this.solver) {
      this.solver.free();
    }
    const size = BoardSize[boardType];
    const now = performance.now();
    this.solver = WasmSolver.new(
      size.height,
      size.width,
      solverType === SolverType.PerfPlus
    );
    const elapsed = performance.now() - now;
    self.postMessage([
      {
        type: MessageType.STATE,
        is_ready: true,
      },
      {
        type: MessageType.TEXT,
        text: `Initialized solver (${elapsed.toFixed(3)}ms)`,
      },
    ]);
  }
  private start(initial: bigint, unique: boolean) {
    if (!this.solver) {
      return;
    }
    const now = performance.now();
    const solutions = this.solver.solve(initial, unique);
    const elapsed = performance.now() - now;
    const results = this.solver.represent_solution(solutions);
    self.postMessage([
      {
        type: MessageType.TEXT,
        text: `Found ${results.length} solutions (${elapsed.toFixed(3)}ms)`,
      },
      {
        type: MessageType.RESULTS,
        results,
      },
    ]);
  }
}

const worker = new Worker();
(async () => {
  await init();
  self.addEventListener("message", (event: MessageEvent) => {
    worker.handleMessage(event.data);
  });
  self.postMessage([{ type: MessageType.INITIALIZED }]);
})();
