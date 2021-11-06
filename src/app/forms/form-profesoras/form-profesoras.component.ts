import { Component, OnInit } from '@angular/core';
import "firebase/firestore";
import {  ActivatedRoute } from '@angular/router';
import { ProfesorasService } from '../../services/profesoras.service';
import { Profesora } from 'src/app/models/profesora.model';
import {Location} from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent} from 'src/app/shared/success-modal/success-modal.component';
import { FailureModalComponent} from 'src/app/shared/failure-modal/failure-modal.component';

@Component({
  selector: 'app-form-profesoras',
  templateUrl: './form-profesoras.component.html',
  styleUrls: ['./form-profesoras.component.scss']
})
export class FormProfesorasComponent implements OnInit {

  profesora: Profesora | any = new Profesora() ;
  esNuevo:boolean = true;
  profesoras: Profesora[] = [];

  validacion = {
    nombres: false,
    apellidos: false,
    celular: false,
    telefono: false,
    correoElectronico: false,
    mostrarError: false
  }

  constructor(
    private profesorasService: ProfesorasService, 
    private route: ActivatedRoute, 
    private _location: Location,
    public modalService: NgbModal
    ) { }

  async ngOnInit()  {
    this.route.queryParams.subscribe(async params => {
      const id = params["id"];
      this.esNuevo = (id == undefined);
      await this.init(id);
    })
    this.profesoras = await this.profesorasService.obtenerProfesoras();
  }
  async init(id:any) {
    if (!this.esNuevo) {
     this.profesora = await this.profesorasService.get(id); 
    }
  }
  validarProfesora(mostrarError = false): boolean {
    if (mostrarError) {
      this.validacion.mostrarError = true;
    }
    this.validacion.nombres = this.profesora.nombres != "" && (/^[A-Z][A-zÀ-ú ]+$/).test(this.profesora.nombres);
    this.validacion.apellidos = this.profesora.apellidos != "" && (/^[A-Z][A-zÀ-ú ]+$/).test(this.profesora.apellidos);
    this.validacion.celular = this.profesora.celular != "" && (/^[0-9]+$/).test(this.profesora.celular);
    if(this.esNuevo)
    {
      this.validacion.celular= !this.profesoras.some((profesora:Profesora) => profesora.celular === this.profesora.celular);
      
    }

    if(this.profesora.telefono === "" || this.profesora.correoElectronico === "")
    {
      this.validacion.correoElectronico = true;
      this.validacion.telefono = true;
    }
    else
    {
      this.validacion.correoElectronico = this.profesora.correoElectronico != "" && (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(this.profesora.correoElectronico);
      this.validacion.telefono = this.profesora.telefono != "" && (/^[0-9]+$/).test(this.profesora.telefono);
      if(this.esNuevo)
      {
        this.validacion.telefono = !this.profesoras.some((profesora:Profesora) => profesora.telefono === this.profesora.telefono);
        
      }
    } 
    const esValido = this.validacion.nombres && this.validacion.apellidos && this.validacion.celular && this.validacion.telefono && this.validacion.correoElectronico;
    return esValido;
  };  

  async abrirModalExito(mensaje:string='') {
    const modalRef = this.modalService.open(SuccessModalComponent);
    modalRef.componentInstance.mensaje = `${mensaje} exitoso`;
    await this.delay(2000) //Esperar antes de cerrar
    modalRef.close();
  }
  async abrirModalError(mensaje:string='') {
    const modalRef = this.modalService.open(FailureModalComponent);
    modalRef.componentInstance.mensaje = `Error en el formulario ${mensaje}`;
    await this.delay(2500) //Esperar antes de cerrar
    modalRef.close();
  }
  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async guardarProfesora() {
    if (this.validarProfesora(true)) {
      
      if (this.esNuevo) {
        this.abrirModalExito('Registro');
        
      }
      else if (!this.esNuevo) {
        this.abrirModalExito('Cambio');
        
      }
      
      
      await this.profesorasService.guardarProfesora(this.profesora, this.esNuevo);
      this._location.back();
    }
    else {
      this.abrirModalError();
    }
  }
  clickAtras(){
    this._location.back();
  }
}
