import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import "firebase/firestore";
import { TratamientosService } from '../../services/tratamientos.service';
import { Tratamiento } from 'src/app/models/tratamiento.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from 'src/app/shared/success-modal/success-modal.component';
import { FailureModalComponent } from 'src/app/shared/failure-modal/failure-modal.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-form-tratamientos',
  templateUrl: './form-tratamientos.component.html',
  styleUrls: ['./form-tratamientos.component.scss']
})
export class FormTratamientosComponent implements OnInit {

  tratamiento: Tratamiento = new Tratamiento();
  validacion = {
    tratamiento: false,
    descripcion: false,
    costo: false,
    mostrarError: false
  }
  mensaje: string = "Registrado Exitosamente!";
  esNuevo: boolean = true;
  constructor(
    private tratamientosService: TratamientosService,
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
  }
  async init(id: any) {
    if (!this.esNuevo) {
      this.tratamiento = await this.tratamientosService.get(id);
    }
  }
  validarTratamiento(mostrarError = false): boolean {
    if (mostrarError) {
      this.validacion.mostrarError = true;
    }

    this.validacion.tratamiento = this.tratamiento.tratamiento != "" && (/^[A-Z][A-zÀ-ú ]+$/).test(this.tratamiento.tratamiento);
    this.validacion.descripcion = this.tratamiento.descripcion != "" && (/^[A-Z][A-zÀ-ú ]+$/).test(this.tratamiento.descripcion);
    const esValido = this.validacion.tratamiento && this.validacion.descripcion;

    return esValido
  }

  async abrirModalExito(mensaje: string = '') {
    const modalRef = this.modalService.open(SuccessModalComponent);
    modalRef.componentInstance.mensaje = `${mensaje} exitoso`;
    await this.delay(2000);
    modalRef.close();
  }
  async abrirModalError(mensaje: string = '') {
    const modalRef = this.modalService.open(FailureModalComponent);
    modalRef.componentInstance.mensaje = `Error en el formulario ${mensaje}`;
    await this.delay(2500);
    modalRef.close();
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async guardarTratamiento() {
    if (this.validarTratamiento(true)) {

      if (this.esNuevo) {
        this.abrirModalExito('Registro');
      }
      else if (!this.esNuevo) {
        this.abrirModalExito('Cambio');

      }

      await this.tratamientosService.guardarTratamiento(this.tratamiento, this.esNuevo);
      this._location.back();
    }
    else {
      this.abrirModalError();
    }
  }

}
