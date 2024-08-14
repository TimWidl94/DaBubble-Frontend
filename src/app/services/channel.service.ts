import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor() { }

  private createChannelSubject = new BehaviorSubject<any>(null);
  public createChannel$ = this.createChannelSubject.asObservable();


  setcreateChannelScreen(value: boolean){
    this.createChannelSubject.next(value);
  }


  createNewChannel(){

  }

}
