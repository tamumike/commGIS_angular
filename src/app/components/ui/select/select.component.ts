import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {
  @Input() value!: string;
  @Input() options!: any[];
  @Output() valueChange = new EventEmitter<string>();
  @ViewChild('select') select!: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  change() {
    let select = this.select.nativeElement;
    this.valueChange.emit(select.value);
  }

}
