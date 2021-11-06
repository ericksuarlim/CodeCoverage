import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Profesora } from 'src/app/models/profesora.model';
import { ProfesorasService } from 'src/app/services/profesoras.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent} from './../../shared/delete-modal/delete-modal.component';


@Component({
  selector: 'app-detalles-profesora',
  templateUrl: './detalles-profesora.component.html',
  styleUrls: ['./detalles-profesora.component.scss']
})
export class DetallesProfesoraComponent implements OnInit {

  id: string = '';
  profesora: Profesora = new Profesora();

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal,
    private profesorasService: ProfesorasService
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id') as string;
       this.profesora = await this.profesorasService.get(this.id);
    });
  }

  async editarProfesora(id:any){
    this.router.navigate(["/form-profesoras"],{queryParams:{id}});   
  }

  abrirModalEliminar(profesora:Profesora) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.tipo = 'Profesora';
    modalRef.componentInstance.mensaje = `¿Estás seguro que quieres eliminar a la profesora ${profesora.nombres} ${profesora.apellidos}?`;
    modalRef.componentInstance.delete.subscribe((confirm: boolean) => {
      if(confirm) {
        this.eliminarProfesora(profesora);
      }
    });
  }

  async eliminarProfesora(profesora:Profesora){
    await this.profesorasService.eliminarProfesora({...profesora});
    this.router.navigateByUrl('/lista-profesoras');
 }

}

