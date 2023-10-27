import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PanelService } from 'src/app/services/panel.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit, OnDestroy {
  public visible!: boolean;
  unsubscribe$: Subject<boolean> = new Subject();
  @ViewChild('wrapper') wrapperRef!: ElementRef;

  @ViewChild('topBar') topBarRef!: ElementRef;

  position: { x: number, y: number } = { x: 175, y: 110 };

  size: { w: number, h: number } = { w: 300, h: 500 };

  lastPosition!: { x: number, y: number };

  lastSize!: { w: number, h: number };

  minSize: { w: number, h: number } = { w: 200, h: 400 };

  constructor(private panelService: PanelService, @Inject(DOCUMENT) private _document: Document, private _el: ElementRef) { }

  ngOnInit(): void {
    this.panelService.getPanelVisibility().pipe(takeUntil(this.unsubscribe$)).subscribe(result => this.visible = result);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  startDrag($event: any): void {
    $event.preventDefault();
    const mouseX = $event.clientX;
    const mouseY = $event.clientY;

    const positionX = this.position.x;
    const positionY = this.position.y;

    const duringDrag = (e: any) => {
      const dx = e.clientX - mouseX;
      const dy = e.clientY - mouseY;
      this.position.x = positionX + dx;
      this.position.y = positionY + dy;
      this.lastPosition = { ...this.position };
    };

    const finishDrag = (e: any) => {
      this._document.removeEventListener('mousemove', duringDrag);
      this._document.removeEventListener('mouseup', finishDrag);
    };

    this._document.addEventListener('mousemove', duringDrag);
    this._document.addEventListener('mouseup', finishDrag);
  }

}
