import { Component, OnInit } from '@angular/core';
import "firebase/firestore";
import { EstadosService } from '../../services/estados.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EstudiantesService } from '../../services/estudiantes.service';
import * as moment from 'moment';
import { Estudiante } from 'src/app/models/estudiante.model';
import { DiagnosticosService } from '../../services/diagnosticos.service';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from 'src/app/shared/success-modal/success-modal.component';
import { FailureModalComponent } from 'src/app/shared/failure-modal/failure-modal.component';
import { DeleteModalComponent } from './../../shared/delete-modal/delete-modal.component';
import { SesionesService } from '../../services/sesiones.service';
import { Sesion } from 'src/app/models/sesion.model';


@Component({
  selector: 'app-form-estudiantes',
  templateUrl: './form-estudiantes.component.html',
  styleUrls: ['./form-estudiantes.component.scss']
})

export class FormEstudiantesComponent implements OnInit {


  estudiante: Estudiante = new Estudiante();
  validacion = {
    nombres: false,
    apellidos: false,
    fecNacimiento: false,
    mes: false,
    anio: false,
    numHistorico: false,
    numGestion: false,
    gestionRegistro: false,
    sexo: false,
    direccion: false,
    estado: false,
    diagnostico: false,
    fechaRegistro: false,
    mostrarError: false
  }
  listaSesionesPorBorrar: Sesion[] = [];
  estados = [];
  diagnosticos = [];
  sesiones = [];
  dicSesiones: any = {};
  esMayor: boolean = false;
  terapias = [];
  mensaje: string = "Registrado Exitosamente!";
  esNuevo: boolean = true;
  estudiantes = [];
  estudiantesDeGestionIngresada = [];
  idEstudianteAuxiliar: string = "";
  estudianteGestionRegistroAuxiliar: string = "";
  estudianteNumGestionAuxiliar: string = "";
  estudianteNumHistoricoAuxiliar: string = "";


  seEstaRegistrando: boolean = false;

  constructor(
    private estudiantesService: EstudiantesService,
    private estadosService: EstadosService,
    private diagnosticosService: DiagnosticosService,
    private sesionesService: SesionesService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    public modalService: NgbModal,
  ) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {

      const id = params["id"];
      const seEstaRegistrando = params["seEstaRegistrando"];
      this.esNuevo = (id == undefined);
      if (this.esNuevo) {
        this.seEstaRegistrando = true;
      }
      else {
        this.seEstaRegistrando = (seEstaRegistrando == "true");
      }
      await this.init(id);
    })

    this.agregarRegistro();
    this.obtenerSesiones();



  }

  async init(id: any) {
    this.estados = await this.estadosService.obtenerEstados();
    this.diagnosticos = await this.diagnosticosService.obtenerDiagnosticos();
    this.estudiantes = await this.estudiantesService.obtenerEstudiantes();
    if (this.esNuevo) {
      this.estudiante.gestionRegistro = moment().format('YYYY');

      var estudiantesDeGestionIngresada = this.estudiantes.filter((estudiante: Estudiante) => estudiante.gestionRegistro === this.estudiante.gestionRegistro);
      if (estudiantesDeGestionIngresada.length === 0) {
        this.estudiante.numGestion = "1";
      }
      else {
        this.estudiante.numGestion = (Math.max.apply(Math, estudiantesDeGestionIngresada.map(function (estudiante: Estudiante) { return (Number(estudiante.numGestion)); })) + 1).toString();
      }
      if (this.estudiantes.length == 0) {
        this.estudiante.numHistorico = "1";
      }
      else {
        this.estudiante.numHistorico = (Math.max.apply(Math, this.estudiantes.map(function (estudiante: Estudiante) { return (Number(estudiante.numHistorico)); })) + 1).toString();
      }
    }
    else {
      this.estudiante = await this.estudiantesService.get(id);
    }
    if (!this.esNuevo && this.estudiante.diagnosticos.length === 0) {
      this.agregarRegistro();
    }
    this.estudianteNumGestionAuxiliar = this.estudiante.numGestion;
    this.estudianteGestionRegistroAuxiliar = this.estudiante.gestionRegistro;
    this.estudianteNumHistoricoAuxiliar = this.estudiante.numHistorico;
  }

  validarEstudiante(mostrarError = false): boolean {
    if (mostrarError) {
      this.validacion.mostrarError = true;
    }

    this.validacion.nombres = this.estudiante.nombres != "" && (/^[A-Z][A-zÀ-ú ]+$/).test(this.estudiante.nombres);
    this.validacion.apellidos = this.estudiante.apellidos != "" && (/^[A-Z][A-zÀ-ú ]+$/).test(this.estudiante.apellidos);
    this.validacion.fecNacimiento = this.estudiante.fecNacimiento < moment().format('YYYY-MM-DD') + 1 && this.estudiante.fecNacimiento != "";
    this.validacion.numHistorico = this.estudiante.numHistorico != "" && (/^[0-9]+$/).test(this.estudiante.numHistorico);
    this.validacion.numGestion = this.estudiante.numGestion != "" && (/^[0-9]+$/).test(this.estudiante.numGestion);
    this.validarGestionRegistro();
    this.validacion.direccion = this.estudiante.direccion != "" && (/^[A-zÀ-ú0-9#°,. ]+$/).test(this.estudiante.direccion);
    this.validarRegistro();

    const esValido = this.validacion.nombres && this.validacion.apellidos && this.validacion.numHistorico && this.validacion.numGestion && this.validacion.gestionRegistro
      && this.validacion.direccion && this.validacion.fecNacimiento && this.validacion.estado && this.validacion.diagnostico && this.validacion.fechaRegistro;
    return esValido;
  };
  validarRegistro() {

    if (this.estudiante.estados.length != 0 && this.estudiante.diagnosticos.length != 0) {
      var tam = this.estudiante.estados.length;
      for (var i = 0; i < tam; i++) {
        if (this.verificarSiRegistroVacio(i)) {
          this.validacion.fechaRegistro = true;
          this.validacion.estado = true;
          this.validacion.diagnostico = true;
        }
        else {
          if(i==0)
          {
            this.validacion.estado = true;
            this.validacion.diagnostico = true;
          }
          else
          {
            this.validacion.estado = true && this.validacion.estado;
            this.validacion.diagnostico = true && this.validacion.diagnostico;
          }
          this.validacion.fechaRegistro = this.estudiante.estados.every((estado: any) => moment(estado.fecha).format("YYYY") >= this.estudiante.gestionRegistro && moment(estado.fecha).format("YYYY-MM-DD") >= this.estudiante.fecNacimiento);
          if (this.estudiante.estados[i].estado == "") {
            this.validacion.estado = false;
          }

          if (this.estudiante.estados[i].fecha == '') {
            this.validacion.fechaRegistro = false;
          }
          if (this.estudiante.diagnosticos[i].diagnostico == "") {
            this.validacion.diagnostico = false;
          }
        }
      }

    }
    else {
      this.validacion.diagnostico = true;
      this.validacion.estado = true;
      this.validacion.fechaRegistro = true;
    }
    return this.validacion.diagnostico && this.validacion.estado && this.validacion.fechaRegistro;
  }
  validarQuelosRegistrosestenLlenos() {
    var tam = this.estudiante.estados.length;
    var res = true;
    for (var i = 0; i < tam; i++) {
      res = res && !this.verificarSiRegistroVacio(i);
    }
    return res;
  }
  verificarSiRegistroVacio(index: any) {
    return this.estudiante.estados[index].estado == "" && this.estudiante.estados[index].fecha == "" && this.estudiante.diagnosticos[index].diagnostico == "";
  }
  validarGestionRegistro() {
    this.validacion.gestionRegistro = this.estudiante.gestionRegistro != "" && (/^[0-9]+$/).test(this.estudiante.gestionRegistro);
    if (this.estudiante.fecNacimiento != "") {

      this.validacion.gestionRegistro = this.estudiante.gestionRegistro >= moment(this.estudiante.fecNacimiento).format("YYYY");
      if (!this.validacion.gestionRegistro) {
        this.validacion.fecNacimiento = false;
      }
    };
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
    await this.delay(4500) //Esperar antes de cerrar
    modalRef.close();
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async guardarEstudiante(tipoCreacion: string = "agregarSinRedirigir") {

    if (this.validarEstudiante(true)) {

      if (this.esNuevo) {
        this.abrirModalExito('Registro');

      }
      else if (!this.esNuevo) {
        this.abrirModalExito('Cambio');

      }
      if (moment(this.estudiante.fecNacimiento).format('M') >= '9') {
        this.estudiante.mes = '0' + moment(this.estudiante.fecNacimiento).format('M');
      }
      else {
        this.estudiante.mes = moment(this.estudiante.fecNacimiento).format('M');
      }

      this.estudiante.anio = moment(this.estudiante.fecNacimiento).format('Y');
      this.estudiante.mes = moment(this.estudiante.fecNacimiento).format('M');
      var tam = this.estudiante.estados.length;
      for (var i = 0; i < tam; i++) {
        if (this.verificarSiRegistroVacio(i)) {
          this.eliminarRegistro(i);
        }
      }
      for (let sesion of this.listaSesionesPorBorrar) {
        this.eliminarSesion(sesion);
      }
      this.idEstudianteAuxiliar = await this.estudiantesService.guardarEstudiante(this.estudiante, this.esNuevo);
      if (tipoCreacion == "soloAgregar") {
        this.router.navigateByUrl('/lista-estudiantes');
      }
      if (tipoCreacion == "esEditar") {
        this.router.navigateByUrl(`detalles-estudiante/${this.estudiante.id}`);
      }
    }
    else {
      this.abrirModalError();
    }
  }

  irDetalleEstudiante() {
    const id = this.estudiante.id;
    console.log(id);
    if (id != "")
      this.router.navigateByUrl(`detalles-estudiante/${id}`);
    else
      this.router.navigateByUrl('/lista-estudiantes');

  }

  async agregarRegistro() {
    this.estudiante.estados.push({ estado: '', fecha: '' });
    this.estudiante.diagnosticos.push({ diagnostico: '' });
    this.estudiante.sesiones.push({ id: '' });
  }

  eliminarRegistro(index: number) {
    this.estudiante.estados.splice(index, 1);
    this.estudiante.sesiones.splice(index, 1);
    this.estudiante.diagnosticos.splice(index, 1);
  }


  clickAtras() {
    this._location.back();
  }

  abrirModalEliminarRegistro(index: number) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.tipo = 'Registro';
    modalRef.componentInstance.mensaje = `¿Estás seguro que quieres eliminar el registro del ${this.estudiante.estados[index].fecha}(Se eliminará la Sesión de este registro también)?`;
    modalRef.componentInstance.delete.subscribe((confirm: boolean) => {
      if (confirm) {
        this.listaSesionesPorBorrar.push(this.dicSesiones[this.estudiante.sesiones[index].id]);
        this.eliminarRegistro(index);

      }
    });
  }

  async eliminarSesion(sesion: Sesion) {
    await this.sesionesService.eliminarSesion({ ...sesion });
  }

  cargarNumeroGestion() {
    if (this.esNuevo) {//Nuevo
      var estudiantesDeGestionIngresada = this.estudiantes.filter((estudiante: Estudiante) => estudiante.gestionRegistro === this.estudiante.gestionRegistro);
      if (estudiantesDeGestionIngresada.length === 0) {
        this.estudiante.numGestion = "1";
      }
      else {
        this.estudiante.numGestion = (Math.max.apply(Math, estudiantesDeGestionIngresada.map(function (estudiante: Estudiante) { return (Number(estudiante.numGestion)); })) + 1).toString();
      }

    }
    else {//Editar
      if (this.estudiante.gestionRegistro != this.estudianteGestionRegistroAuxiliar) {
        var estudiantesDeGestionIngresada = this.estudiantes.filter((estudiante: Estudiante) => estudiante.gestionRegistro === this.estudiante.gestionRegistro);
        if (estudiantesDeGestionIngresada.length === 0) {
          this.estudiante.numGestion = "1";
        }
        else {
          this.estudiante.numGestion = (Math.max.apply(Math, estudiantesDeGestionIngresada.map(function (estudiante: Estudiante) { return (Number(estudiante.numGestion)); })) + 1).toString();
        }
      }
      else {
        this.estudiante.gestionRegistro = this.estudianteGestionRegistroAuxiliar;
        this.estudiante.numGestion = this.estudianteNumGestionAuxiliar;
        this.estudianteNumHistoricoAuxiliar = this.estudianteNumHistoricoAuxiliar;
      }
    }
  }

  async dirigirApoderado(id: string) {
    if (this.validarEstudiante(true)) {
      await this.guardarEstudiante("porApoderado");
      var auxIdEstudiante = this.idEstudianteAuxiliar;
      this.router.navigate(["/form-apoderados"], { queryParams: { id, auxIdEstudiante } });
    }
  }

  async agregarEditar() {
    this.guardarEstudiante();
    if (this.validarEstudiante()) {
      this.clickAtras();
    }
  }

  async crearSesion(id: string, estudiante: any, index: any) {
    if (this.validarRegistro()) {
      if (this.validarEstudiante(true)) {
        if (this.validarQuelosRegistrosestenLlenos()) {
          await this.guardarEstudiante();
          if (!this.esNuevo) {

            this.router.navigate(["/form-sesiones"], { queryParams: { id, estudiante, index } });
          }
          else {
            var seEstaregistrando = true;
            estudiante = this.idEstudianteAuxiliar;
            this.router.navigate(["/form-sesiones"], { queryParams: { id, estudiante, index, seEstaregistrando } });
          }
        }
        else {
          this.abrirModalError(": No se puede agregar sesión si existe algún registro vacío");
        }
      }
      else {
        this.abrirModalError();
      }
    }
    else {
      this.validacion.mostrarError = true;
      this.abrirModalError(": No se puede agregar sesión si existe algún error en los registros");
    }
  }

  async verSesion(id: any) {
    this.router.navigateByUrl(`detalles-sesion/${id}`);
  }

  initDicSesiones() {
    this.sesiones.forEach((sesion: Sesion) => { this.dicSesiones[sesion.id] = sesion; });
  }

  async obtenerSesiones() {
    this.sesiones = await this.sesionesService.obtenerSesiones();
    this.initDicSesiones();
  }
}