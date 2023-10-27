import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sizer',
  templateUrl: './sizer.component.html',
  styleUrls: ['./sizer.component.css']
})
export class SizerComponent implements OnInit {
@Input() size! : string;
@Output() sizeChange = new EventEmitter<string>();
@Input() label!: string;
@Input() maxValue: number = 100;
@Input() step: number = 1;
dec() { this.changeSize(-(this.step)) }
inc() { this.changeSize(+(this.step)) }


  constructor() { }

  ngOnInit() {
  }

  changeSize(value: number) {
    let newValue = (parseInt(this.size) + value);
    if (newValue <= this.maxValue && newValue >= 0) {
      this.size = newValue.toString();

    }
    this.sizeChange.emit(this.size);
  }

}
