import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  public isPanelVisibleObs$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public activeWidget!: string;

constructor() { }

getPanelVisibility(): Observable<boolean> {
  return this.isPanelVisibleObs$.asObservable();
}

togglePanelVisibility(value: boolean): void {
  this.isPanelVisibleObs$.next(value);
}

setActiveWidget(id: string): void {
  this.activeWidget = id;
}

clearActiveWidget(): void {
  this.activeWidget = '';
}

getActiveWidget(): string {
  return this.activeWidget;
}

}
