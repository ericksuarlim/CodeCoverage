import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/firestore";
import { Tratamiento } from '../models/tratamiento.model';

@Injectable({
  providedIn: 'root'
})
export class TratamientosService {

  constructor() { }
  async obtenerTratamientos() {
    const db = firebase.firestore();

    return await db.collection("tratamientos").get().then(function (querySnapshot) {
      const tratamientos: any = [];
      querySnapshot.forEach(function (doc) {
        tratamientos.push(doc.data());
      });
      return tratamientos;
    });
  }

  async guardarTratamiento(tratamiento: Tratamiento, esNuevo: boolean) {
    const db = firebase.firestore();
    if (esNuevo) {
      const id = await db.collection("tratamientos").doc().id;
      tratamiento.id = id;
    }
    await db.collection("tratamientos").doc(tratamiento.id).set({ ...tratamiento });
  }

  async get(id: any): Promise<Tratamiento> {
    const db = firebase.firestore();
    return (await db.collection("tratamientos").doc(id).get()).data() as Tratamiento;
  }

  async eliminarTratamiento(tratamiento: Tratamiento) {
    const db = firebase.firestore();
    await db.collection("tratamientos").doc(tratamiento.id).delete();

  }
}
