export interface ThreadMessage {
  id: number;
  channel: number;
  sender: number;
  content: string;
  timestamp: string;
  threadOpen: boolean;
  thread_channel: number;
}
