import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sesion } from 'src/app/models/sesion.model';
import { SesionesService } from 'src/app/services/sesiones.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from './../../shared/delete-modal/delete-modal.component';
import { Location } from '@angular/common';
import { Profesora } from 'src/app/models/profesora.model';
import { ProfesorasService } from 'src/app/services/profesoras.service';
import { Estudiante } from 'src/app/models/estudiante.model';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { Tratamiento } from 'src/app/models/tratamiento.model';
import { TratamientosService } from 'src/app/services/tratamientos.service';
import * as moment from 'moment';

@Component({
  selector: 'app-detalles-sesion',
  templateUrl: './detalles-sesion.component.html',
  styleUrls: ['./detalles-sesion.component.scss']
})
export class DetallesSesionComponent implements OnInit {

  id: string = '';
  sesion: Sesion = new Sesion();
  profesoras = [];
  dicProfesoras: any = {};
  estudiantes: Estudiante[] = [];
  dicEstudiantes: any = {};
  tratamientos = [];
  dicTratamientos: any = {};
  asistencias = [];
  dicAsistencias: any = {};
  deuda: any = 0;

  constructor(
    private route: ActivatedRoute,
    private sesionesService: SesionesService,
    private tratamientosService: TratamientosService,
    private profesorasService: ProfesorasService,
    public router: Router,
    public modalService: NgbModal,
    private estudiantesService: EstudiantesService,
    private _location: Location
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id') as string;
      await Promise.all([
        this.obtenerSesion(),
        this.obtenerProfesoras(),
        this.obtenerEstudiantes(),
        this.obtenerTratamientos()
      ]);
    });
  }

  async editarSesion(id: any) {
    this.router.navigate(["/form-sesiones"], { queryParams: { id } });
  }
  abrirModalEliminar(sesion: Sesion) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.type = 'Sesion';
    modalRef.componentInstance.mensaje = `¿Estás seguro que quieres eliminar la sesión?`;
    modalRef.componentInstance.delete.subscribe((confirm: boolean) => {
      if (confirm) {
        this.eliminarSesion(sesion);
      }
    });
  }

  async obtenerSesion() {
    this.sesion = await this.sesionesService.get(this.id);
    var suma = 0;
    this.sesion.cuotas.forEach(function (numero) { suma += Number(numero) })
    this.deuda = suma;
  }
  async eliminarSesion(sesion: Sesion) {
    await this.sesionesService.eliminarSesion({ ...sesion });
    this.router.navigateByUrl('/lista-sesiones');
  }
  clickAtras() {
    this._location.back();
  }
  mostrarBienLaFecha(fecha: string) {
    return moment(fecha).format('DD/MM/YYYY');
  }
  initDicProfesoras() {
    this.profesoras.forEach((profesora: Profesora) => { this.dicProfesoras[profesora.nombres] = profesora; });

  }

  async obtenerProfesoras() {
    this.profesoras = await this.profesorasService.obtenerProfesoras();
    this.initDicProfesoras();
  }

  initDicEstudiantes() {
    this.estudiantes.forEach((estudiante: Estudiante) => { this.dicEstudiantes[estudiante.id] = estudiante; });
  }

  async obtenerEstudiantes() {
    this.estudiantes = await this.estudiantesService.obtenerEstudiantes();
    this.initDicEstudiantes();
  }

  initDicTratamientos() {
    this.tratamientos.forEach((tratamiento: Tratamiento) => { this.dicTratamientos[tratamiento.id] = tratamiento; });
  }

  async obtenerTratamientos() {
    this.tratamientos = await this.tratamientosService.obtenerTratamientos();
    this.initDicTratamientos();
  }

}
