import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message, MessageList } from '../models/message.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Channel } from '../models/channel.model';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  private apiUrl = environment.baseUrl;

  threadSubject = new BehaviorSubject<any>(null); // Angepasst zu `any`
  thread$ = this.threadSubject.asObservable();

  private selectedThreadMessagesSubject = new BehaviorSubject<Message[]>([]);
  public selectedThreadMessages$ = this.selectedThreadMessagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Methode zum Aktualisieren einer Nachricht, um einen Thread zu öffnen
  openThread(channelId: number, messageId: number): Observable<any> {
    const body = { threadOpen: true };
    return this.http.patch(`${this.apiUrl}/channel/${channelId}/messages/${messageId}/`, body)
      .pipe(
        tap((response: any) => {
          this.threadSubject.next(response); // Direkte Aktualisierung der `threadSubject`
        })
      );
  }

  // Methode zum Erstellen oder Aktualisieren einer Nachricht
  getThreadMessages(threadChannelId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/channelThread/${threadChannelId}/messages/`)
      .pipe(
        tap((messages: any) => {
          this.selectedThreadMessagesSubject.next(messages); // Aktualisiert die Nachrichten
        })
      );
  }

  sendThreadMessage(threadChannelId: number, content: string): Observable<any> {
    const body = { content: content, thread_channel_id: threadChannelId };
    return this.http.post(`${this.apiUrl}/channelThread/${threadChannelId}/messages/`, body)
      .pipe(
        tap((message: any) => {
          this.selectedThreadMessagesSubject.next([...this.selectedThreadMessagesSubject.getValue(), message]);
        })
      );
  }

  loadThread(channelId: number): void {
    this.getThreadMessages(channelId).subscribe(
      (messages) => {
        this.selectedThreadMessagesSubject.next(messages);
      },
      (error) => {
        console.error('Fehler beim Laden des Threads:', error);
      }
    );
  }

  updateThreadMessage(channelId: number, messageId: number, content: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/channelThread/${channelId}/messages/${messageId}/`, { content });
  }

  updateThreadMessageEmojis(channelId: number, messageId: number, emojiData: any): Observable<any> {
    const url = `${this.apiUrl}/channelThread/${channelId}/messages/${messageId}/emoji/`;
    return this.http.patch(url, emojiData);
  }
}
