import { Component, OnInit } from '@angular/core';
import "firebase/firestore";
import { ActivatedRoute } from '@angular/router';
import { DiagnosticosService } from '../../services/diagnosticos.service';
import { Diagnostico } from 'src/app/models/diagnostico.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent} from 'src/app/shared/success-modal/success-modal.component';
import { FailureModalComponent} from 'src/app/shared/failure-modal/failure-modal.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-form-diagnosticos',
  templateUrl: './form-diagnosticos.component.html',
  styleUrls: ['./form-diagnosticos.component.scss']
})
export class FormDiagnosticosComponent implements OnInit {

  diagnostico: Diagnostico | any = new Diagnostico();
  validacion={
    codigoColor:false,
    color:false,
    diagnostico:false,
    mostrarError:false
  }
  esNuevo:boolean = true;
  mensaje: string="Registrado Exitosamente!";
  
  constructor(
    private diagnosticosService: DiagnosticosService, 
    private route: ActivatedRoute, 
    public modalService: NgbModal,
    private _location: Location
  ) {}

  async ngOnInit()  {
    this.route.queryParams.subscribe(async params => {
      const id = params["id"];
      this.esNuevo = (id == undefined);
      await this.init(id);
    })
  }
  async init(id:any) {
    if (!this.esNuevo) {
      this.diagnostico = await this.diagnosticosService.get(id); 
     }
  }

  validarDiagnostico(mostrarError=false):boolean {
    if(mostrarError){
      this.validacion.mostrarError=true;
    }
    this.validacion.codigoColor=this.diagnostico.codigoColor != "" &&(/^[A-zÀ-ú ]+$/).test(this.diagnostico.codigoColor);
    this.validacion.diagnostico=this.diagnostico.diagnostico != "" &&(/^[A-zÀ-ú -.]+$/).test(this.diagnostico.diagnostico);
    const esValido=this.validacion.codigoColor && this.validacion.diagnostico;
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


  async guardarDiagnostico() {
    if (this.validarDiagnostico(true)) {
      
      if (this.esNuevo) {
        this.abrirModalExito('Registro');
        
      }
      else if (!this.esNuevo) {
        this.abrirModalExito('Cambio');
        
      }
      
      
      await this.diagnosticosService.guardarDiagnostico(this.diagnostico, this.esNuevo);
      this._location.back();
    }
    else {
      this.abrirModalError();
    }
  }
}
