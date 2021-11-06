import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/firestore";
import { Estado } from '../models/estado.model';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  constructor() { }

  async obtenerEstados() {
    const db = firebase.firestore();
    return await db.collection("estados").get().then(function (querySnapshot) {
      const estados: any = [];
      querySnapshot.forEach(function (doc) {
        estados.push(doc.data());
      });
      return estados;
    });

  }

  async guardarEstado(estado: Estado, esNuevo: boolean) {
    const db = firebase.firestore();
    if (esNuevo) {
      const id = await db.collection("estados").doc().id;
      estado.id = id;
    }
    await db.collection("estados").doc(estado.id).set({ ...estado });
  }

  async get(id: any): Promise<Estado> {
    const db = firebase.firestore();
    return (await db.collection("estados").doc(id).get()).data() as Estado;

  }

  async eliminarEstado(estado: Estado) {
    const db = firebase.firestore();
    await db.collection("estados").doc(estado.id).delete();
  }
}