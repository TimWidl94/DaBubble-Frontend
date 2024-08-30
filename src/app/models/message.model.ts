import { User } from "./user.model";

export interface Message {
  id: number;
  channel: number;
  sender: number;
  content: string;
  timestamp: string;
  user?: User;
  threadOpen?: boolean;
  thread_channel: number;
}

export type MessageList = Message[];
