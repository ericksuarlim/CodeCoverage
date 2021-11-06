import { Component, OnInit } from '@angular/core';
import "firebase/firestore";
import { Router, ActivatedRoute } from '@angular/router';
import { ApoderadosService } from '../../services/apoderados.service';
import { EstudiantesService } from '../../services/estudiantes.service';
import { Apoderado } from 'src/app/models/apoderado.model';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from 'src/app/shared/success-modal/success-modal.component';
import { FailureModalComponent } from 'src/app/shared/failure-modal/failure-modal.component';


@Component({
  selector: 'app-form-apoderados',
  templateUrl: './form-apoderados.component.html',
  styleUrls: ['./form-apoderados.component.scss']
})
export class FormApoderadosComponent implements OnInit {

  apoderado: Apoderado | any = new Apoderado();
  validacion = {
    nombres: false,
    apellidos: false,
    celular: false,
    telefono: false,
    gradoRelacion: false,
    correoElectronico: false,
    direccion: false,
    estudiante: false,
    mostrarError: false
  }
  apoderados: Apoderado[] = [];
  estudiantes: any = [];
  dicEstudiantes: any ={};
  esNuevo: boolean = true;
  mensaje: string = "Registrado Exitosamente!";
  esPorEstudiante: boolean = false;

  constructor(
    private apoderadosService: ApoderadosService,
    private estudiantesService: EstudiantesService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    public modalService: NgbModal,

  ) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const id = params["id"];
      const idEstudianteUrl = params["auxIdEstudiante"];
      if(idEstudianteUrl == undefined || idEstudianteUrl =="")
      {
        this.esPorEstudiante=false;
      }
      else
      {
        this.esPorEstudiante=true;
      }
      if(this.esPorEstudiante)
      {
        this.apoderado.estudiantes.push({ id: idEstudianteUrl });
      }   
      this.esNuevo = (id == undefined || id=="");
      await this.init(id);
    })
    if(!this.esPorEstudiante)
    {
      this.agregarEstudiante();
    }
    this.apoderados = await  this.apoderadosService.obtenerApoderados(); 

  }

  async init(id: any) {
    if (!this.esNuevo) 
    {
      this.apoderado = await this.apoderadosService.get(id);
    }
    this.estudiantes = await this.estudiantesService.obtenerEstudiantes();
  }

  validarApoderado(mostrarError = false): boolean {
    if (mostrarError) {
      this.validacion.mostrarError = true;
    }
    this.validacion.nombres = this.apoderado.nombres != "" && (/^[A-Z][A-zÀ-ú ]+$/).test(this.apoderado.nombres);
    this.validacion.apellidos = this.apoderado.apellidos != "" && (/^[A-Z][A-zÀ-ú ]+$/).test(this.apoderado.apellidos);
    this.validacion.celular = this.apoderado.celular != "" && (/^[0-9]+$/).test(this.apoderado.celular) ;
    this.validacion.gradoRelacion = this.apoderado.gradoRelacion != "" && (/^[A-zÀ-ú ]+$/).test(this.apoderado.gradoRelacion);
    this.validacion.direccion = this.apoderado.direccion != "" && (/^[A-zÀ-ú0-9#°. ]+$/).test(this.apoderado.direccion);
    
    if (this.esNuevo)
    {
      this.validacion.celular = !this.apoderados.some((apoderado:Apoderado) => apoderado.celular === this.apoderado.celular);
    }

    if( this.apoderado.telefono === ""  || this.apoderado.correoElectronico === "")
    {
      this.validacion.telefono =true;
      this.validacion.correoElectronico = true;
    }
    else
    {
      this.validacion.telefono = this.apoderado.telefono != "" && (/^[0-9]+$/).test(this.apoderado.telefono);
      this.validacion.correoElectronico = this.apoderado.correoElectronico != "" && (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(this.apoderado.correoElectronico);
      if (this.esNuevo)
      {
        this.validacion.telefono= !this.apoderados.some((apoderado:Apoderado) => apoderado.telefono === this.apoderado.telefono);
      }
    }
    const esValido = this.validacion.nombres && this.validacion.apellidos && this.validacion.celular && this.validacion.gradoRelacion && this.validacion.direccion && this.validacion.telefono && this.validacion.correoElectronico;
    return esValido;
  };

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

  async guardarApoderado() {
    if (this.validarApoderado(true)) {

      if (this.esNuevo) {
        this.abrirModalExito('Registro');

      }
      else if (!this.esNuevo) {
        this.abrirModalExito('Cambio');

      }
      this.agregarApoderado()
      await this.apoderadosService.guardarApoderado(this.apoderado, this.esNuevo);
      if(!this.esPorEstudiante)
      {
        this._location.back();
      }
      else{
        this.router.navigateByUrl('/lista-estudiantes');
      }
    }
    else {
      this.abrirModalError();
    }
  }

  async agregarApoderado() {
    for (var e of this.apoderado.estudiantes) {
      var aux = 0;
      var estudianteActualizado = await this.estudiantesService.get(e.id);
      var apoderadoBuscado = (await this.apoderadosService.get(this.apoderado.id)).id
      for (let ap of estudianteActualizado.apoderados) {
        if (apoderadoBuscado == ap.id) {
          aux = 1;
        }
      }
      if (aux == 0) {
        estudianteActualizado.apoderados.push({ id: this.apoderado.id })
      }
      await this.estudiantesService.guardarEstudiante(estudianteActualizado, false);
    }
  }

  async eliminarApoderado(id: number) {
    var estudiante = await this.estudiantesService.get(this.apoderado.estudiantes[id].id);
    var apoderadoBuscado = (await this.apoderadosService.get(this.apoderado.id)).id
    for (let index = 0; index < estudiante.apoderados.length; index++) {
      if (apoderadoBuscado == estudiante.apoderados[index].id) {
        estudiante.apoderados.splice(index, 1);
      }
    }
    await this.estudiantesService.guardarEstudiante(estudiante, false);

  }

  async agregarEstudiante() {
    this.apoderado.estudiantes.push({ id: '' });
  }

  eliminarEstudiante(index: number) {
    this.eliminarApoderado(index);
    this.apoderado.estudiantes.splice(index, 1);
  }

  clickAtras(){
    this._location.back();
  }
}

