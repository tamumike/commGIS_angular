import { Component, OnInit } from '@angular/core';
import { config } from '../../../config';

@Component({
  selector: 'app-widget-list',
  templateUrl: './widget-list.component.html',
  styleUrls: ['./widget-list.component.css']
})
export class WidgetListComponent implements OnInit {
  public widgets: string[] = config.widgets;

  constructor() { }

  ngOnInit(): void {
  }

}
