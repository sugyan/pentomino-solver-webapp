export const SolverType = {
  Light: "Light",
  PerfPlus: "Perf+",
} as const;
export type SolverType = (typeof SolverType)[keyof typeof SolverType];

export const BoardType = {
  Rect6x10: "6x10",
  Rect5x12: "5x12",
  Rect4x15: "4x15",
  Rect3x20: "3x20",
  Rect8x8_2x2: "8x8 with 2x2 hole",
} as const;
export type BoardType = (typeof BoardType)[keyof typeof BoardType];

export const BoardSize: Record<BoardType, { height: number; width: number }> = {
  [BoardType.Rect6x10]: { height: 6, width: 10 },
  [BoardType.Rect5x12]: { height: 5, width: 12 },
  [BoardType.Rect4x15]: { height: 4, width: 15 },
  [BoardType.Rect3x20]: { height: 3, width: 20 },
  [BoardType.Rect8x8_2x2]: { height: 8, width: 8 },
} as const;
