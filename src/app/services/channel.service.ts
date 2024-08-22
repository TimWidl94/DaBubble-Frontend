import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { tap } from 'rxjs/operators';
import { Channel } from '../models/channel.model';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.baseUrl;

  private privateChannels: Channel []= [];
  private allChannel: any[] = [];
  private createChannelSubject = new BehaviorSubject<any>(null);
  public createChannel$ = this.createChannelSubject.asObservable();

  private allChannelSubject = new BehaviorSubject<any>(null);
  public allChannel$ = this.allChannelSubject.asObservable();

  private selectedChannelSubject = new BehaviorSubject<Channel | null>(null);
  public selectedChannel$ = this.selectedChannelSubject.asObservable();

  setcreateChannelScreen(value: boolean) {
    this.createChannelSubject.next(value);
  }

  getAllChannelSubject() {
    this.allChannelSubject.value;
  }

  createChannel(channelData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/channel/`, channelData);
  }

  loadAllChannels() {
    this.http.get<any>(`${this.apiUrl}/channel`).subscribe((channels) => {
      this.allChannelSubject.next(channels);
    });
  }

  fetchAllChannel(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/channel`).pipe(
      tap((data) => (this.allChannel = data)) // Channels in das Array speichern
    );
  }

  loadSelectedChannel(channelId: number) {
    this.http.get<any>(`${this.apiUrl}/channel/${channelId}`).subscribe(
      //richtige channel id hinzufügen
      (channel) => {
        this.selectedChannelSubject.next(channel);
      },
      (error) => {
        console.error('Fehler beim Laden des Channels:', error);
      }
    );
  }

  fetchSingleChannel(channelId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/channel/${channelId}`).pipe(
      tap((data) => (this.allChannel = data)) // Channels in das Array speichern
    );
  }

  updateChannel(channel: Channel, channelId:number): Observable<any>{
    return this.http.put(`${this.apiUrl}/channel/${channelId}`, channel);
  }

  fetchPrivatChannel(): Observable<Channel[]>{
    return this.http.get<Channel[]>(`${this.apiUrl}/private-channel/`).pipe(
      tap((data)=> (this.privateChannels = data))
    )
  }

  createPrivateChannel(channelData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/private-channel/`, channelData);
  }
}
