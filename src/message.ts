import { BoardType, SolverType } from "./types.ts";

export const MessageType = {
  // from main to worker
  SOLVER: "solver",
  START: "start",
  // from worker to main
  INITIALIZED: "initialized",
  STATE: "state",
  TEXT: "text",
  RESULTS: "results",
} as const;
export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export interface SolverMessage {
  type: typeof MessageType.SOLVER;
  solver_type: SolverType;
  board_type: BoardType;
}

export interface StartMessages {
  type: typeof MessageType.START;
  initial: bigint;
  unique: boolean;
}

export interface InitializedMessage {
  type: typeof MessageType.INITIALIZED;
}

export interface StateMessage {
  type: typeof MessageType.STATE;
  is_ready: boolean;
}

export interface TextMessage {
  type: typeof MessageType.TEXT;
  text: string;
}

export interface ResultsMessage {
  type: typeof MessageType.RESULTS;
  results: string[][];
}

export type MainMessage = SolverMessage | StartMessages;
export type WorkerMessage = (
  | InitializedMessage
  | StateMessage
  | TextMessage
  | ResultsMessage
)[];
