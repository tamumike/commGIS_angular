import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalActionService } from 'src/app/services/modal-action.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  public status!: string;
  @ViewChild('layerName') layerNameEl!: ElementRef;


  constructor(public dialogRef: MatDialogRef<ModalComponent>,@Inject(MAT_DIALOG_DATA) public modalData: any,
  private modalActionService: ModalActionService) { }

  ngOnInit(): void {
    this.status = this.modalData.name;
  }
  actionFunction() {

    if (this.layerNameEl.nativeElement.value) {
      this.modalData.title = this.layerNameEl.nativeElement.value;
      this.modalData.id = this.layerNameEl.nativeElement.value.replace(' ', '-');
    }

    this.modalActionService.modalAction(this.modalData);
    this.closeModal();
  }

  closeModal(type?: string) {

    if (type == 'cancel') {
      this.dialogRef.close(type);
    } else {
      this.dialogRef.close();
    }

  }

}
