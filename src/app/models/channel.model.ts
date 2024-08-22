import { Message } from "./message.model";

export interface Channel {
  id: number;
  channelName: string;
  channelDescription: string;
  channelMembers: number[];
  messages: Message [];
  createdFrom: string;
}
