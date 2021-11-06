import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';


@Component({
  selector: 'app-reset-password-success-modal',
  templateUrl: './reset-password-success-modal.component.html',
  styleUrls: ['./reset-password-success-modal.component.scss']
})
export class ResetPasswordSuccessModalComponent implements OnInit {
  
  @Output() delete: EventEmitter<boolean> = new EventEmitter();

  mensaje:string = '';
  claveCambiada:boolean=false

  constructor(
    private activeModal: NgbActiveModal

  ) {}

  async ngOnInit() {
    this.claveCambiada = true;
  }

  async confirmar() {
    this.delete.emit(true);
    this.activeModal.close();
  }
  async cancelar() {
    this.delete.emit(false);
    this.activeModal.close();
  }

}
