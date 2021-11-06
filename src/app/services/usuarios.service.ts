import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor() { }

  usuario: any = {
    id:"",
    email:""
  }
  async obtenerUsuarios() {
    const db = firebase.firestore();

    return await db.collection("usuarios").get().then(function (querySnapshot) {
      const usuarios: any = [];
      querySnapshot.forEach(function (doc) {
        usuarios.push(doc.data());
      });
      return usuarios
    });
  }
  async guardarUsuario(email:any) {
    const db = firebase.firestore();
    const id = await db.collection("usuarios").doc().id;
    this.usuario.id = id;
    this.usuario.email = email; 
    await db.collection("usuarios").doc(this.usuario.id).set({...this.usuario});
  }
}

