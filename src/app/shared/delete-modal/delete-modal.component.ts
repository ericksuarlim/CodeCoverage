import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

  @Output() delete: EventEmitter<boolean>  = new EventEmitter();

  tipo: string = '';
  mensaje:string = '';

  constructor(
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
  }

  async confirmar(){
    this.delete.emit(true);
    this.activeModal.close();
  }

  async cancelar(){
    this.delete.emit(false);
    this.activeModal.close(); 
  }

}