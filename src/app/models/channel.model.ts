import { Message } from "./message.model";

export interface Channel {
  id: number;
  channelName: string;
  channelDescription: string;
  channelMembers: number[];
  messages: Message [];
  createdFrom: {
    email: string;
    first_name: string;
    id: number;
    last_name: string;
  };
  channelPartner?: number;
  privateChannel: boolean;
}
