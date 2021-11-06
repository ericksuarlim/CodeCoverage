import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Estudiante } from 'src/app/models/estudiante.model';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from './../../shared/delete-modal/delete-modal.component';
import { ApoderadosService } from 'src/app/services/apoderados.service';
import { EstadosService } from 'src/app/services/estados.service';
import { DiagnosticosService } from 'src/app/services/diagnosticos.service';
import { Estado } from 'src/app/models/estado.model';
import { Diagnostico } from 'src/app/models/diagnostico.model';
import { FormEstudiantesComponent } from 'src/app/forms/form-estudiantes/form-estudiantes.component'
import { Location } from '@angular/common';
import { Apoderado } from 'src/app/models/apoderado.model';
import * as moment from 'moment';
import { SesionesService } from 'src/app/services/sesiones.service';
import { Sesion } from 'src/app/models/sesion.model';
import { Tratamiento } from 'src/app/models/tratamiento.model';
import { TratamientosService } from 'src/app/services/tratamientos.service';
import { Profesora } from 'src/app/models/profesora.model';
import { ProfesorasService } from 'src/app/services/profesoras.service';

@Component({
  selector: 'app-detalles-estudiante',
  templateUrl: './detalles-estudiante.component.html',
  styleUrls: ['./detalles-estudiante.component.scss']
})
export class DetallesEstudianteComponent implements OnInit {

  id: string = '';
  estudiante: Estudiante = new Estudiante();
  apoderados = [];
  estados = [];
  diagnosticos = [];
  dicEstados: any = {};
  dicDiagnosticos: any = {};
  dicApoderados: any = {};
  tratamientos = [];
  dicTratamientos: any = {};
  sesiones = [];
  dicSesiones: any = {};
  profesoras = [];
  dicProfesoras: any = {};
  constructor(
    private route: ActivatedRoute,
    private estudiantesService: EstudiantesService,
    private apoderadosService: ApoderadosService,
    private estadosService: EstadosService,
    private diagnosticosService: DiagnosticosService,
    private sesionesService: SesionesService,
    private tratamientosService: TratamientosService,
    private profesorasService: ProfesorasService,
    public router: Router,
    public modalService: NgbModal,
    private _location: Location

  ) { }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id') as string;
      await Promise.all([
        this.obtenerEstudiante(),
        this.obtenerApoderados(),
        this.obtenerEstados(),
        this.obtenerDiagnosticos(),
        this.obtenerProfesoras(),
        this.obtenerSesiones(),
        this.obtenerTratamientos()
      ]);
    });
  }

  async editarEstudiante(id: any) {
    this.router.navigate(["/form-estudiantes"], { queryParams: { id } });
  }
  async eliminarSesion(sesion: Sesion) {
    await this.sesionesService.eliminarSesion({ ...sesion });
  }
  abrirModalEliminar(estudiante: Estudiante) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.tipo = 'Estudiante';
    modalRef.componentInstance.mensaje = `¿Estás seguro que quieres eliminar al estudiante ${estudiante.nombres} ${estudiante.apellidos}?`;
    modalRef.componentInstance.delete.subscribe((confirm: boolean) => {
      if (confirm) {
        for (let sesion of estudiante.sesiones) {
          this.eliminarSesion(this.dicSesiones[sesion.id]);
        }
        this.eliminarEstudiante(estudiante);
      }
    });
  }

  initDicEstados() {
    this.estados.forEach((estado: Estado) => { this.dicEstados[estado.estado] = estado; });
  }
  initDicDiagnosticos() {
    this.diagnosticos.forEach((diagnostico: Diagnostico) => { this.dicDiagnosticos[diagnostico.diagnostico] = diagnostico; });
  }
  initDicApoderados() {
    this.apoderados.forEach((apoderado: Apoderado) => { this.dicApoderados[apoderado.id] = apoderado; });
  }

  mostrarBienLaFecha(fecha: string) {
    return moment(fecha).format('DD/MM/YYYY');
  }

  async obtenerEstudiante() {
    this.estudiante = await this.estudiantesService.get(this.id);
  }

  async obtenerApoderados() {
    this.apoderados = await this.apoderadosService.obtenerApoderados();
    this.initDicApoderados();
  }

  async obtenerEstados() {
    this.estados = await this.estadosService.obtenerEstados();
    this.initDicEstados();
  }

  async obtenerDiagnosticos() {
    this.diagnosticos = await this.diagnosticosService.obtenerDiagnosticos();
    this.initDicDiagnosticos();
  }
  async eliminarEstudianteDeApoderado(estudiante: Estudiante) {
    for (let index = 0; index < estudiante.apoderados.length; index++) {
      var apoderado = await this.apoderadosService.get(this.estudiante.apoderados[index].id);
      for (let index = 0; index < apoderado.estudiantes.length; index++) {
        if (estudiante.id == apoderado.estudiantes[index].id) {
          apoderado.estudiantes.splice(index, 1);
        }
      }
      await this.apoderadosService.guardarApoderado(apoderado, false);
    }
  }

  async eliminarEstudiante(estudiante: Estudiante) {
    this.eliminarEstudianteDeApoderado(estudiante);
    await this.estudiantesService.eliminarEstudiante({ ...estudiante });
    this.router.navigateByUrl('/lista-estudiantes');
  }
  clickAtras() {
    this._location.back();
  }

  abrirEdicionSesion(sesion: Sesion) {
    this.router.navigateByUrl(`detalles-sesion/${sesion.id}`);
  }
  initDicTratamientos() {
    this.tratamientos.forEach((tratamiento: Tratamiento) => { this.dicTratamientos[tratamiento.id] = tratamiento; });
  }

  async obtenerTratamientos() {
    this.tratamientos = await this.tratamientosService.obtenerTratamientos();
    this.initDicTratamientos();
  }

  initDicSesiones() {
    this.sesiones.forEach((sesion: Sesion) => { this.dicSesiones[sesion.id] = sesion; });
  }

  async obtenerSesiones() {
    this.sesiones = await this.sesionesService.obtenerSesiones();
    this.initDicSesiones();
  }

  initDicProfesoras() {
    this.profesoras.forEach((profesora: Profesora) => { this.dicProfesoras[profesora.nombres] = profesora; });
  }

  async obtenerProfesoras() {
    this.profesoras = await this.profesorasService.obtenerProfesoras();
    this.initDicProfesoras();
  }
}
