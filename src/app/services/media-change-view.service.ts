import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaChangeViewService {

  constructor() { }

  private devspaceScreenSubject = new BehaviorSubject<boolean>(true);
  devspaceScreen$ = this.devspaceScreenSubject.asObservable();

  private chatScreenSubject = new BehaviorSubject<boolean>(false);
  chatScreen$ = this.chatScreenSubject.asObservable();

  private threadScreenSubject = new BehaviorSubject<boolean>(false);
  threadScreen$ = this.threadScreenSubject.asObservable();

  private fullsizeShadowMobileSubject = new BehaviorSubject<boolean>(false);
  fullsizeShadow$ = this.fullsizeShadowMobileSubject.asObservable();

  private headerDevspaceMobileOnSubject = new BehaviorSubject<boolean>(false);
  headerDevspaceMobileOn$ = this.headerDevspaceMobileOnSubject.asObservable();

  setChatScreenMobile(value: boolean) {
    this.chatScreenSubject.next(value);
  }

  setDevspaceScreenMobile(value: boolean){
    this.devspaceScreenSubject.next(value);
  }

  setThreadScreenMobile(value: boolean){
    this.threadScreenSubject.next(value);
  }

  setFullSizeShadowMobile(value: boolean){
    this.fullsizeShadowMobileSubject.next(value);
  }

  setDevspaceHeaderMobile(value: boolean){
    this.headerDevspaceMobileOnSubject.next(value);
  }
}
