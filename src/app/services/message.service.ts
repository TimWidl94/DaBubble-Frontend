import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { tap, switchMap } from 'rxjs/operators';
import { Message, MessageList } from '../models/message.model';


@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = environment.baseUrl;
  private pollingInterval = 5000;
  private pollingSubscription: Subscription | null = null;

  constructor(private http: HttpClient) {}

  messages: any [] = [];

  private messagesSubject = new BehaviorSubject<MessageList>([]);
  messages$ = this.messagesSubject.asObservable();

  sendMessage(channelId: number, formData: FormData): Observable<any> {
    // Die FormData anstelle eines JSON-Objekts senden
    return this.http.post(`${this.apiUrl}/channel/${channelId}/messages/`, formData);
  }

  getMessages(channelId: number){
    this.http.get<any>(`${this.apiUrl}/channel/${channelId}/messages/`).subscribe((messages) => {
      this.messagesSubject.next(messages);
    });
  }

  startPollingMessages(channelId: number): void {
    this.stopPollingMessages();

    this.pollingSubscription = interval(this.pollingInterval)
      .pipe(switchMap(() => this.http.get<any>(`${this.apiUrl}/channel/${channelId}/messages/`)))
      .subscribe((messages) => {
        this.messagesSubject.next(messages);
      });
  }

  stopPollingMessages(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  updateMessage(channelId: number, messageId: number, content: string, emojiData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/channel/${channelId}/messages/${messageId}/`, { content, emojiData});
  }

  updateMessageEmojis(channelId: number, messageId: number, emojiData: any): Observable<any> {
    const url = `${this.apiUrl}/channel/${channelId}/messages/${messageId}/emoji/`;
    return this.http.patch(url, emojiData);
  }
}
