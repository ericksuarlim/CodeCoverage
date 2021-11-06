import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from '../../services/usuarios.service'
import { Observable, from } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import firebase from 'firebase/app';
import "firebase/firestore";
import { ResetPasswordSuccessModalComponent } from '../reset-password-success-modal/reset-password-success-modal.component'



@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.scss']
})
export class ResetPasswordModalComponent implements OnInit {

  @Output() delete: EventEmitter<boolean> = new EventEmitter();


  email = '';
  usuarios: any = [];

  validacion = {
    correoValido: false,
    usuarioVerificado: false,
    mostrarError: false
  }
  constructor(

    private activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public usuariosService: UsuariosService

  ) { }


  async ngOnInit() {
    await Promise.all([
      this.obtenerUsuarios()
    ])
  }

  async confirmar() {
    this.delete.emit(true);
    this.activeModal.close();
  }
  async cancelar() {
    this.delete.emit(false);
    this.activeModal.close();
  }

  validarCorreo() {

    if (this.validacion.correoValido) {

      this.confirmar();
    }
    if (this.email.length === 0) {
      return true
    }
    else
      return this.validacion.correoValido;

  }
  verificarUsuario() {
    let verificado = false;
    this.usuarios.forEach((usuario: any) => {
      if (usuario.email == this.email) {
        verificado = true;

      }
    });
    return verificado;

  }
  async obtenerUsuarios() {
    this.usuarios = await this.usuariosService.obtenerUsuarios();
  }
  validarUsuario(mostrarError = false): boolean {
    if (mostrarError) {
      this.validacion.mostrarError = true;
    }
    this.email = this.email.replace(/\s/g, '');
    this.validacion.correoValido = this.email != "" && (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).test(this.email);
    this.validacion.usuarioVerificado = this.verificarUsuario();


    const esValido = this.validacion.correoValido && this.validacion.usuarioVerificado;
    return esValido;

  }
  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async enviar() {
    if (this.validarUsuario(true)) {

      await this.delay(1000)
      this.enviarCorreoRestablecimiento();
      this.activeModal.close();
      this.abrirModalMensajeEnviado();
    }
  }

  enviarCorreoRestablecimiento(): Observable<void> {
    var observableFromPromise = from(firebase.auth().sendPasswordResetEmail(this.email));
    return observableFromPromise;
  }
  abrirModalMensajeEnviado() {
    const modalRef = this.modalService.open(ResetPasswordSuccessModalComponent);
    modalRef.componentInstance.mensaje = `Se ha enviado un correo electrónico a ${this.email}`;
  }
  obtenerCorreoElectronico() {
    return this.email;
  }
}

