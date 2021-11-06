import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/firestore";
import { Apoderado } from '../models/apoderado.model';

@Injectable({
  providedIn: 'root'
})
export class ApoderadosService {

  constructor() { }

  async obtenerApoderados() {
    const db = firebase.firestore();

    return await db.collection("apoderados").get().then(function (querySnapshot) {
      const apoderados:any = [];
      querySnapshot.forEach(function (doc) {
        apoderados.push(doc.data());
      });
      return apoderados;
    });

  }
  async guardarApoderado(apoderado:Apoderado, esNuevo:boolean) {
    const db = firebase.firestore();
    if (esNuevo) {
      const id = await db.collection("apoderados").doc().id;
      apoderado.id = id;
    }
    await db.collection("apoderados").doc(apoderado.id).set({...apoderado});
  }
  async get(id: any): Promise<Apoderado> {
    const db = firebase.firestore();
    return (await db.collection("apoderados").doc(id).get()).data() as Apoderado;
  }
  
  async eliminarApoderado(apoderado:Apoderado) {
    const db = firebase.firestore();
    await db.collection("apoderados").doc(apoderado.id).delete();
  }
}
