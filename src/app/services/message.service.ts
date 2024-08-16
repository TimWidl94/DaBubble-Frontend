import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'http://your-api-url.com/channel';

  constructor(private http: HttpClient) {}

  sendMessage(channelId: number, content: string): Observable<any> {
    const body = { content };
    return this.http.post(`${this.apiUrl}/${channelId}/message`, body);
  }
}
