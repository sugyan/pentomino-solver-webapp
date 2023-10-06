/* tslint:disable */
/* eslint-disable */
/**
*/
export class Solutions {
  free(): void;
}
/**
*/
export class WasmSolver {
  free(): void;
/**
* @param {number} rows
* @param {number} cols
* @param {boolean} large_table
* @returns {WasmSolver}
*/
  static new(rows: number, cols: number, large_table: boolean): WasmSolver;
/**
* @param {bigint} initial
* @param {boolean} unique
* @returns {Solutions}
*/
  solve(initial: bigint, unique: boolean): Solutions;
/**
* @param {Solutions} solutions
* @returns {any[]}
*/
  represent_solution(solutions: Solutions): any[];
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_solutions_free: (a: number) => void;
  readonly __wbg_wasmsolver_free: (a: number) => void;
  readonly wasmsolver_new: (a: number, b: number, c: number) => number;
  readonly wasmsolver_solve: (a: number, b: number, c: number) => number;
  readonly wasmsolver_represent_solution: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
