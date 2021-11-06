import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import "firebase/firestore";
import { EstadosService } from '../../services/estados.service';
import { Estado } from 'src/app/models/estado.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent} from 'src/app/shared/success-modal/success-modal.component';
import { FailureModalComponent} from 'src/app/shared/failure-modal/failure-modal.component';
import {Location} from '@angular/common';


@Component({
  selector: 'app-form-estados',
  templateUrl: './form-estados.component.html',
  styleUrls: ['./form-estados.component.scss']
})
export class FormEstadosComponent implements OnInit {

  estado: Estado | any = new Estado();
  estados: Estado[] = [];

  validacion = {
    numEstado: false,
    estado: false,
    mostrarError: false
  }

  esNuevo: boolean = true;

  constructor(
    private estadosService: EstadosService,
    private route: ActivatedRoute, 
    public modalService: NgbModal,
    private _location: Location
  ) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const id = params["id"];
      this.esNuevo = (id == undefined);
      await this.init(id);
    })
    this.estados = await this.estadosService.obtenerEstados();
  }

  async init(id: any) {
    if (!this.esNuevo) {
      this.estado = await this.estadosService.get(id);
    }
  }
  validarEstado(mostrarError = false): boolean {
    if (mostrarError) {
      this.validacion.mostrarError = true;
    }
    this.validacion.numEstado = this.estado.numEstado != "" && (/^[0-9]+$/).test(this.estado.numEstado);

    if (this.esNuevo) {
      this.validacion.numEstado = this.estado.numEstado && !this.estados.some((estado: Estado) => estado.numEstado === this.estado.numEstado);
    }
    this.validacion.estado = this.estado.estado != "" && (/^[A-Z][A-zÀ-ú ]+$/).test(this.estado.estado);
    const esValido = this.validacion.numEstado && this.validacion.estado;
    return esValido
  }

  async abrirModalExito(mensaje: string = '') {
    const modalRef = this.modalService.open(SuccessModalComponent);
    modalRef.componentInstance.mensaje = `${mensaje} exitoso`;
    await this.delay(2000) //Esperar antes de cerrar
    modalRef.close();
  }
  async abrirModalError(mensaje: string = '') {
    const modalRef = this.modalService.open(FailureModalComponent);
    modalRef.componentInstance.mensaje = `Error en el formulario ${mensaje}`;
    await this.delay(2500) //Esperar antes de cerrar
    modalRef.close();
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async guardarEstado() {
    if (this.validarEstado(true)) {
      if (this.esNuevo) {
        this.abrirModalExito('Registro');
      }
      else if (!this.esNuevo) {
        this.abrirModalExito('Cambio');
      }
      await this.estadosService.guardarEstado(this.estado, this.esNuevo);
      this._location.back();
    }
    else {
      this.abrirModalError();
    }
  }
}

