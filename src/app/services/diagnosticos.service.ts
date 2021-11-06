import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/firestore";
import { Diagnostico } from '../models/diagnostico.model';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticosService {

  constructor() { }
  async obtenerDiagnosticos() {
    const db = firebase.firestore();
    return await db.collection("diagnosticos").get().then(function (querySnapshot) {
      const diagnosticos:any = [];
      querySnapshot.forEach(function (doc) {
        diagnosticos.push(doc.data());
      });
      return diagnosticos;
    });

  }

  async guardarDiagnostico(diagnostico:Diagnostico, esNuevo:boolean) {
    const db = firebase.firestore();
    if (esNuevo) {
      const id = await db.collection("diagnosticos").doc().id;
      diagnostico.id = id;
    }
    await db.collection("diagnosticos").doc(diagnostico.id).set({...diagnostico});
  }

  async get(id:any){
    const db = firebase.firestore();
    return (await db.collection("diagnosticos").doc(id).get()).data();  
  }

  async eliminarDiagnostico(diagnostico:Diagnostico) {
    const db = firebase.firestore();
    await db.collection("diagnosticos").doc(diagnostico.id).delete();
 }
}
