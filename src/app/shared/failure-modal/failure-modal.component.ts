import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-failure-modal',
  templateUrl: './failure-modal.component.html',
  styleUrls: ['./failure-modal.component.scss']
})
export class FailureModalComponent implements OnInit {

  @Output() accept: EventEmitter<boolean>  = new EventEmitter();

  mensaje:string = '';

  constructor(
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
  }
  
  async cerrar(){
    this.accept.emit(true);
    this.activeModal.close();
  }

}
