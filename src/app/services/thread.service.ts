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
  private apiUrl = environment.baseUrl; // Passe den URL entsprechend an

  threadSubject = new BehaviorSubject<MessageList>([]);
  thread$ = this.threadSubject.asObservable();

  private selectedThreadMessagesSubject = new BehaviorSubject<Message[]>([]);
  public selectedThreadMessages$ = this.selectedThreadMessagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Methode zum Aktualisieren einer Nachricht, um einen Thread zu öffnen
  openThread(channelId: number, messageId: number): Observable<any> {
    const body = { threadOpen: true };
    return this.http
      .patch(`${this.apiUrl}/channel/${channelId}/messages/${messageId}/`, body)
      .pipe(
        map((response: any) => {
          if (response.id) {
            this.threadSubject.next(response);
          }
          return response;
        })
      );
  }

  // Methode zum Erstellen oder Aktualisieren einer Nachricht
  getThreadMessages(threadChannelId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/channelThread/${threadChannelId}/`);
  }

  // Methode zum Senden einer Nachricht in einem Thread
  sendThreadMessage(threadChannelId: number, content: any): Observable<any> {
    const body = { content: content, thread_channel_id: threadChannelId };
    return this.http.post(
      `${this.apiUrl}/channelThread/${threadChannelId}/messages/`,
      body
    );
  }

  loadThread(channelId: number){
    this.http.get<any>(`${this.apiUrl}/channelThread/${channelId}`).subscribe(
      //richtige channel id hinzufügen
      (channel) => {
        this.selectedThreadMessagesSubject.next(channel);
      },
      (error) => {
        console.error('Fehler beim Laden des Channels:', error);
      }
    );
  }
}
