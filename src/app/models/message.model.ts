import { User } from './user.model';

export interface Message {
  id: number;
  channel: number;
  sender: number;
  content: string;
  timestamp: string;
  user?: User;
  threadOpen?: boolean;
  thread_channel: number;
  emoji_check: User[];
  emoji_handsup: User[];
  emoji_nerd: User[];
  emoji_rocket: User[];
  [key: string]: any;
}

export type MessageList = Message[];
