import { Component, OnInit } from '@angular/core';
import { Apoderado } from 'src/app/models/apoderado.model';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DeleteModalComponent } from './../../shared/delete-modal/delete-modal.component';
import { EstudiantesService } from '../../services/estudiantes.service';
import { ApoderadosService } from 'src/app/services/apoderados.service';
import { Estudiante } from 'src/app/models/estudiante.model';
@Component({
  selector: 'app-detalles-apoderado',
  templateUrl: './detalles-apoderado.component.html',
  styleUrls: ['./detalles-apoderado.component.scss']
})
export class DetallesApoderadoComponent implements OnInit {

  id: string = '';
  apoderado: Apoderado = new Apoderado();
  estudiantes = [];
  esNuevo: boolean = true;
  dicEstudiantes: any = {};

  constructor(
    private route: ActivatedRoute,
    private apoderadosService: ApoderadosService,
    private estudiantesService: EstudiantesService,
    public router: Router,
    public modalService: NgbModal
  ) { }
  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id') as string;
      this.apoderado = await this.apoderadosService.get(this.id);
      this.estudiantes = await this.estudiantesService.obtenerEstudiantes();
      this.initDicEstudiantes()
    });
  }
  abrirModalEliminar(apoderado: Apoderado) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.tipo = 'Apoderado';
    modalRef.componentInstance.mensaje = `¿Estás seguro que quieres eliminar al Apoderado ${apoderado.nombres} ${apoderado.apellidos}?`;
    modalRef.componentInstance.delete.subscribe((confirm: boolean) => {
      if (confirm) {
        this.eliminarApoderado(apoderado);
      }
    });
  }
  async eliminarApoderadoDeEstudiante(apoderado: Apoderado) {
    for (let index = 0; index < apoderado.estudiantes.length; index++) {
      var estudiante = await this.estudiantesService.get(this.apoderado.estudiantes[index].id);
      for (let index = 0; index < estudiante.apoderados.length; index++) {
        if (apoderado.id == estudiante.apoderados[index].id) {
          estudiante.apoderados.splice(index, 1);
        }
      }
      await this.estudiantesService.guardarEstudiante(estudiante, false);
    }
  }
  async eliminarApoderado(apoderado: Apoderado) {
    this.eliminarApoderadoDeEstudiante(apoderado);
    await this.apoderadosService.eliminarApoderado({ ...apoderado });
    this.router.navigateByUrl('/lista-apoderados');
  }
  async editarApoderado(id: any) {
    this.router.navigate(["/form-apoderados"], { queryParams: { id } });
  }
  initDicEstudiantes() {
    this.estudiantes.forEach((estudiante: Estudiante) => { this.dicEstudiantes[estudiante.id] = estudiante; });
  }
}
