export const BoardType = {
  rect6x10: "6x10",
  rect5x12: "5x12",
  rect4x15: "4x15",
  rect3x20: "3x20",
  rect8x8_2x2: "8x8 with 2x2 hole",
} as const;
export type BoardType = (typeof BoardType)[keyof typeof BoardType];

export const BoardSize: Record<BoardType, { height: number; width: number }> = {
  [BoardType.rect6x10]: { height: 6, width: 10 },
  [BoardType.rect5x12]: { height: 5, width: 12 },
  [BoardType.rect4x15]: { height: 4, width: 15 },
  [BoardType.rect3x20]: { height: 3, width: 20 },
  [BoardType.rect8x8_2x2]: { height: 8, width: 8 },
} as const;
