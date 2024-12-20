import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private triggerMapMethodSource = new Subject<void>();

  triggerMapMethod$ = this.triggerMapMethodSource.asObservable();

  callMapMethod() {
    this.triggerMapMethodSource.next();
  }

}
