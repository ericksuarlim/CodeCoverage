import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/firestore";
import { Profesora } from '../models/profesora.model';

@Injectable({
  providedIn: 'root'
})
export class ProfesorasService {

  constructor() { }
  async obtenerProfesoras() {
    const db = firebase.firestore();
    return await db.collection("profesoras").get().then(function (querySnapshot) {
      const profesoras: any = [];
      querySnapshot.forEach(function (doc) {
        profesoras.push(doc.data());
      });
      return profesoras;
    });

  }

  async guardarProfesora(profesora: Profesora, esNuevo: boolean) {
    const db = firebase.firestore();
    if (esNuevo) {
      const id = await db.collection("profesoras").doc().id;
      profesora.id = id;
    }
    await db.collection("profesoras").doc(profesora.id).set({ ...profesora });
  }

  async get(id: any): Promise<Profesora> {
    const db = firebase.firestore();
    return (await db.collection("profesoras").doc(id).get()).data() as Profesora;
  }

  async eliminarProfesora(profesora: Profesora) {
    const db = firebase.firestore();
    await db.collection("profesoras").doc(profesora.id).delete();
  }

  async porProfesoras() {
    const db = firebase.firestore();
    var tamañoDProfesora: any = [];
    await (await db.collection("profesoras").get()).forEach((q) => { tamañoDProfesora.push(q.data().profesora) })
    return tamañoDProfesora;
  }
}
