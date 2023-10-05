import init, { WasmSolver } from "./lib/pentomino_solver_wasm";

(async () => {
  await init();

  self.addEventListener("message", () => {
    const solver = WasmSolver.new(6, 10);
    const now = performance.now();
    const solutions = solver.solve(BigInt(0), true);
    const elapsed = performance.now() - now;
    const results = solver.represent_solution(solutions);
    self.postMessage({
      results,
      elapsed,
    });
    solver.free();
  });
})();
