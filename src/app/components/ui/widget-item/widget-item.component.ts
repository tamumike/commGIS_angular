import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MapDataService } from 'src/app/services/map-data.service';
import { PanelService } from 'src/app/services/panel.service';
import { PanelComponent } from '../panel/panel.component';

@Component({
  selector: 'app-widget-item',
  templateUrl: './widget-item.component.html',
  styleUrls: ['./widget-item.component.css']
})
export class WidgetItemComponent implements OnInit, OnDestroy {

@Input() widgetInfo: any;
private panelVisiblity!: boolean;
unsubscribe$: Subject<boolean> = new Subject();

  constructor(public panelService: PanelService, public router: Router, public mapDataService: MapDataService) { }

  ngOnInit(): void {
    this.panelService.getPanelVisibility().pipe(takeUntil(this.unsubscribe$)).subscribe(result => this.panelVisiblity = result);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  launchWidget(): void {
    let activeWidget = this.panelService.getActiveWidget();

    // check if widget is already open
    if (activeWidget == this.widgetInfo) {
      // close panel and clear out active widget
      this.panelService.togglePanelVisibility(false);
      this.panelService.clearActiveWidget();
    }
    else {
      // open widget and set active widget in panel service
      this.panelService.togglePanelVisibility(true);
      this.panelService.setActiveWidget(this.widgetInfo);
      this.router.navigate([this.widgetInfo]);
    }

  }
}
