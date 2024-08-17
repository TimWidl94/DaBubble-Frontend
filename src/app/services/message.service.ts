import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { tap } from 'rxjs/operators';
import { Message, MessageList } from '../models/message.model';


@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  messages: any [] = [];

  private messagesSubject = new BehaviorSubject<MessageList>([]);
  messages$ = this.messagesSubject.asObservable();

  sendMessage(channelId: number, messageData: any): Observable<any> {
    const body = {
      content: messageData.content,
      sender: messageData.sender,
      channel: channelId // Hier wird die Channel-ID übermittelt
    };
    return this.http.post(`${this.apiUrl}/channel/${channelId}/message`, body);
  }

  getMessages(channelId: number){
    this.http.get<any>(`${this.apiUrl}/channel/${channelId}/message`).subscribe((messages) => {
      this.messagesSubject.next(messages);
    });
  }

}
