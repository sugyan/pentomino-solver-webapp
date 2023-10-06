export const MessageType = {
  TEXT: "text",
  RESULTS: "results",
} as const;
export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export interface TextMessage {
  type: typeof MessageType.TEXT;
  text: string;
}

export interface ResultsMessage {
  type: typeof MessageType.RESULTS;
  results: string[][];
}

export type Message = TextMessage | ResultsMessage;
