import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/firestore";
import { forEachChild } from 'typescript';
import { Estudiante } from '../models/estudiante.model';
@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  constructor() { }

  async obtenerEstudiantes() {
    const db = firebase.firestore();

    return await db.collection("estudiantes").get().then(function (querySnapshot) {
      const estudiantes: any = [];
      querySnapshot.forEach(function (doc) {
        estudiantes.push(doc.data());
      });
      return estudiantes;
    });
  }

  async  guardarEstudiante(estudiante: Estudiante, esNuevo:boolean) {
    const db = firebase.firestore();
    if (esNuevo) {
      const id = await db.collection("estudiantes").doc().id;
      estudiante.id = id;
    }
    await db.collection("estudiantes").doc(estudiante.id).set({...estudiante});
    return estudiante.id;
  }

  async get(id: any): Promise<Estudiante> {
    const db = firebase.firestore();
    return (await db.collection("estudiantes").doc(id).get()).data() as Estudiante;
  }

  async eliminarEstudiante(estudiante: Estudiante) {
    const db = firebase.firestore();
    await db.collection("estudiantes").doc(estudiante.id).delete();
  }

  async porSexo(){
    const db = firebase.firestore();
    var tamañoPorMasculino= await (await db.collection("estudiantes").where("sexo","==","Masculino").get()).docs.length;
    var tamañoPorFemenino= await (await db.collection("estudiantes").where("sexo","==","Femenino").get()).docs.length;
    return [tamañoPorMasculino,tamañoPorFemenino]
  }

  async porSexoMasculino(){
    const db = firebase.firestore();
    var tamañoPorMasculino= await (await db.collection("estudiantes").where("sexo","==","Masculino").get()).docs.length;
    return tamañoPorMasculino;
  }

  async porSexoFemenino(){
    const db = firebase.firestore();
    var tamañoPorFemenino= await (await db.collection("estudiantes").where("sexo","==","Femenino").get()).docs.length;
    return tamañoPorFemenino;
  }

  async porDiagnosticos(){
    const db = firebase.firestore();
    var tamañoDiagnostico:any= [];
    await (await db.collection("estudiantes").get()).forEach((q)=>{ tamañoDiagnostico.push(q.data().diagnosticos)})
    return tamañoDiagnostico;
  }

 async porEstados(){
  const db = firebase.firestore();
  var tamañoEstados:any= [];
  await (await db.collection("estudiantes").get()).forEach((q)=>{ tamañoEstados.push(q.data().estados)})
  return tamañoEstados;
 }
}
