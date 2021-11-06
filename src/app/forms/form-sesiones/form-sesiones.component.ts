import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import "firebase/firestore";
import { SesionesService } from '../../services/sesiones.service';
import { Sesion } from 'src/app/models/sesion.model';
import { TratamientosService } from '../../services/tratamientos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from 'src/app/shared/success-modal/success-modal.component';
import { FailureModalComponent } from 'src/app/shared/failure-modal/failure-modal.component';
import { Location } from '@angular/common';
import { ProfesorasService } from '../../services/profesoras.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { Estudiante } from 'src/app/models/estudiante.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-form-sesiones',
  templateUrl: './form-sesiones.component.html',
  styleUrls: ['./form-sesiones.component.scss']
})
export class FormSesionesComponent implements OnInit {
  sesion: Sesion = new Sesion();
  mensaje: string = "Registrado Exitosamente!";
  esNuevo: boolean = true;
  cuota: boolean = false;
  sesiones = [];
  profesoras: any = [];

  estudiantes: any = [];
  dicEstudiantes: any = {};

  tratamientos: any = [];
  indexTemporal: number = 0;
  cantidadDeAsistencias: number = this.sesion.asistencias.length;
  cantidadDeCuotas: number = this.sesion.cuotas.length;
  tipoP: string = "";
  seEstaRegistrando: boolean = false;
  validacion = {
    estudiante: false,
    profesora: false,
    tratamiento: false,
    asistencia: false,
    tipoDePago: false,
    costoPorSesion: false,
    cuotas: false,
    mostrarError: false,
    cantidadDeAsistencias: false,
    cantidadDeCuotas: false,
    fecha: false,
    hora: false
  }
  constructor(
    private sesionesService: SesionesService,
    private profesorasService: ProfesorasService,
    private estudiantesService: EstudiantesService,
    private tratamientoService: TratamientosService,
    public router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal,
    private _location: Location) {

  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const id = params["id"];
      const estudiante = params["estudiante"];
      const seEstaregistrando = params["seEstaregistrando"];
      this.indexTemporal = Number(params["index"]);
      this.sesion.estudiante.id = estudiante;
      this.esNuevo = (id == undefined || id == "");
      this.seEstaRegistrando = (seEstaregistrando != undefined || seEstaregistrando == "true");
      await this.init(id);
      await this.obtenerEstudiantes();
    })
  }
  async init(id: any) {

    this.sesiones = await this.sesionesService.obtenerSesiones();
    this.profesoras = await this.profesorasService.obtenerProfesoras();
    this.estudiantes = await this.estudiantesService.obtenerEstudiantes();
    this.tratamientos = await this.tratamientoService.obtenerTratamientos();

    if (!(this.esNuevo)) {
      this.sesion = await this.sesionesService.get(id);
    }

    this.cantidadDeAsistencias = this.sesion.asistencias.length;
    this.cantidadDeCuotas = this.sesion.cuotas.length;
  }

  validarSesion(mostrarError = false): boolean {
    if (mostrarError) {
      this.validacion.mostrarError = true;
    }
    this.validacion.costoPorSesion = this.sesion.costoPorSesion != "" && (/^[0-9]+$/).test(this.sesion.costoPorSesion);
    this.validacion.tipoDePago = this.sesion.tipoDePago != "";
    if (this.sesion.asistencias.length != 0) {
      this.validacion.fecha = this.sesion.asistencias.every((asistencia: any) => asistencia.fecha != "");
      this.validacion.hora = this.sesion.asistencias.every((asistencia: any) => asistencia.hora != "");
    }
    const esValido = this.validacion.costoPorSesion && this.validacion.tipoDePago && this.actualizarCuotasAsistenciasSegunTipo(mostrarError,false) && this.validarParteMedia(mostrarError) && this.validacion.fecha && this.validacion.hora;

    return esValido;
  }

  validarParteMedia(mostrarError = false): boolean {
    if (mostrarError) {
      this.validacion.mostrarError = true;
    }
    this.validacion.profesora = this.sesion.profesora.nombres != "";
    this.validacion.estudiante = this.sesion.estudiante.id != "";
    this.validacion.tratamiento = this.sesion.tratamiento.id != "";
    const esValido = this.validacion.profesora && this.validacion.estudiante && this.validacion.tratamiento;
    return esValido;
  }

  async abrirModalExito(mensaje: string = '') {
    const modalRef = this.modalService.open(SuccessModalComponent);
    modalRef.componentInstance.mensaje = `${mensaje} exitoso`;
    await this.delay(2000)
    modalRef.close();
  }

  async abrirModalError(mensaje: string = '') {
    const modalRef = this.modalService.open(FailureModalComponent);
    modalRef.componentInstance.mensaje = `Error en el formulario ${mensaje}`;
    await this.delay(2500)
    modalRef.close();
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async guardarSesion() {
    if (this.validarSesion(true)) {
      if (this.esNuevo) {
        this.abrirModalExito('Registro');

      }
      else if (!this.esNuevo) {
        this.abrirModalExito('Cambio');
      }

      this.sesion.profesora = this.sesion.profesora;
      this.sesion.estudiante = this.sesion.estudiante;
      this.sesion.tratamiento = this.sesion.tratamiento;
      const idTempSesion= await this.sesionesService.guardarSesion(this.sesion, this.esNuevo);
      if (this.esNuevo) {
        var estudianteActualizado = this.dicEstudiantes[this.sesion.estudiante.id];
        estudianteActualizado.sesiones[this.indexTemporal].id = idTempSesion;
        await this.estudiantesService.guardarEstudiante(estudianteActualizado, false);
        this.IrEditarEstudiante();
      }
      else { this._location.back(); }
    }
    else {
      this.abrirModalError();
    }
  }

  clickAtras() {
    this._location.back();
  }


  actalizarMontos() {
    var costoSesion = 0;
    if (this.sesion.costoPorSesion != "" && this.sesion.costoPorSesion != null) {
      costoSesion = parseInt(this.sesion.costoPorSesion);
    }
    const monto = (costoSesion * this.sesion.asistencias.length) / this.sesion.cuotas.length;
    for (var i = 0; i < this.sesion.cuotas.length; i++) {
      this.sesion.cuotas[i] = String(monto);
    }
  }
  validarCostoPorSesisón() {
    this.validacion.costoPorSesion = this.sesion.costoPorSesion != "" && (/^[0-9]+$/).test(this.sesion.costoPorSesion);
    return this.validacion.costoPorSesion;

  }
  validarCantidadDeAsistencias() {
    if (this.cantidadDeAsistencias > 0) {
      this.validacion.cantidadDeAsistencias = true;
    }
    return this.validacion.cantidadDeAsistencias;
  }
  validarCantidadDeCuotas() {
    if (this.cantidadDeCuotas > 0) {
      this.validacion.cantidadDeCuotas = true;
    }
    return this.validacion.cantidadDeCuotas;
  }
  actualizarCuotasAsistenciasSegunTipo(mostrarError = false, actualizar=false): boolean {
    var res = false;
    if (this.sesion.tipoDePago == "Unica sesion" && this.validarCostoPorSesisón()) {
      if(actualizar)
      {this.actalizarCuotas(1);
      this.actalizarAsistencias(1);}
      res = true;
    }
    else {
      if (this.sesion.tipoDePago == "Mensual al contado" && this.validarCostoPorSesisón() && this.validarCantidadDeAsistencias()) {
        if(actualizar)
        {this.actalizarCuotas(1);
        this.actalizarAsistencias(this.cantidadDeAsistencias);}
        res = true;
      }
      else {
        if (this.sesion.tipoDePago == "Mensual a cuotas" && this.validarCostoPorSesisón() && this.validarCantidadDeAsistencias() && this.validarCantidadDeCuotas()) {
          if(actualizar)
          {this.actalizarCuotas(this.cantidadDeCuotas);
          this.actalizarAsistencias(this.cantidadDeAsistencias);}
          res = true;
        }
        else {
          if (mostrarError) {
            this.validacion.mostrarError = true;
          }
        }
      }
    }
    return res;
  }
  actalizarCuotas(cant: number) {
    const largo = this.sesion.cuotas.length;

    if (largo != cant) {
      if (largo < cant) {
        for (var i = 0; i < cant - largo; i++) {
          this.agregarCuota();
        }
      }
      else {
        for (var i = 0; i < largo - cant; i++) {
          this.eliminarCuota();
        }
      }
    }
    this.actalizarMontos();
  }
  async agregarCuota() {
    this.sesion.cuotas.push("");
  }

  eliminarCuota() {
    this.sesion.cuotas.splice(-1, 1);
  }

  actalizarAsistencias(cant: number) {
    const largo = this.sesion.asistencias.length;
    if (largo != cant) {
      if (largo < cant) {
        for (var i = 0; i < cant - largo; i++) {
          this.agregarAsistencia();
        }
      }
      else {
        for (var i = 0; i < largo - cant; i++) {
          this.eliminarAsistencia();
        }
      }
    }
    this.actalizarMontos();
  }
  async agregarAsistencia() {
    this.sesion.asistencias.push({ fecha: '', hora: '' });
  }

  initDicEstudiantes() {
    this.estudiantes.forEach((estudiante: Estudiante) => { this.dicEstudiantes[estudiante.id] = estudiante; });
  }

  async obtenerEstudiantes() {
    this.estudiantes = await this.estudiantesService.obtenerEstudiantes();
    this.initDicEstudiantes();
  }

  eliminarAsistencia() {
    this.sesion.asistencias.splice(-1, 1);
  }

  validarCuotasYAsistencia() {
    if (this.cantidadDeAsistencias > 0 && this.cantidadDeCuotas > 0) {
      this.validacion.cantidadDeAsistencias = true;
      this.validacion.cantidadDeCuotas = true;
    }
    else {
      if (this.cantidadDeAsistencias > 0) {
        this.validacion.cantidadDeAsistencias = true;
      }
      else {
        if (this.cantidadDeCuotas > 0) {
          this.validacion.cantidadDeCuotas = true;
        }
      }
    }
  }

  async IrEditarEstudiante() {
    const id = this.sesion.estudiante.id;
    const seEstaRegistrando = this.seEstaRegistrando;
    this.router.navigate(["/form-estudiantes"], { queryParams: { id, seEstaRegistrando } });
  }
}