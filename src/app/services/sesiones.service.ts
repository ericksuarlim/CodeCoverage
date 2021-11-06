import { Injectable } from '@angular/core';
import firebase from 'firebase/app'
import "firebase/firestore"
import { Sesion } from '../models/sesion.model';

@Injectable({
  providedIn: 'root'
})
export class SesionesService {

  constructor() { }

  async obtenerSesiones() {
    const db = firebase.firestore();

    return await db.collection("sesiones").get().then(function (querySnapshot) {
      const sesiones: any = [];
      querySnapshot.forEach(function (doc) {
        sesiones.push(doc.data());
      });
      return sesiones;
    });
  }

  async get(id: any): Promise<Sesion> {
    const db = firebase.firestore();
    return (await db.collection("sesiones").doc(id).get()).data() as Sesion;
  }
  async eliminarSesion(sesion: Sesion) {
    const db = firebase.firestore();
    await db.collection("sesiones").doc(sesion.id).delete();
  }

  async guardarSesion(sesion: Sesion, esNuevo: boolean) {
    const db = firebase.firestore();
    if (esNuevo) {
      const id = db.collection("sesiones").doc().id;
      sesion.id = id;
    }
    await db.collection("sesiones").doc(sesion.id).set({ ...sesion });
    return sesion.id;
  }

  async porProfesoras() {
    const db = firebase.firestore();
    var tamañoDProfesora: any = [];
    await (await db.collection("sesiones").get()).forEach((q) => { tamañoDProfesora.push(q.data().profesora) })
    return tamañoDProfesora;
  }

  async obtenerListaAsistencias() {
    var listaAsistencias: any = []
    const db = firebase.firestore();
    (await db.collection("sesiones").get()).forEach((e) => { listaAsistencias.push(e.data().asistencias) });
    return listaAsistencias;
  }
  async obtenerListaFechas(anio: number) {
    var listaFechas: any = [];
    var object: any = await this.obtenerListaAsistencias()
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key];
        for (const key1 in element) {
          if (Object.prototype.hasOwnProperty.call(element, key1)) {
            const element1 = element[key1];
            if (this.obtenerAño(element1.fecha) == anio) {
              listaFechas.push(element1.fecha)
            }
          }
        }
      }
    }
    return await listaFechas
  }
  async obtenerListaFechasGlobal() {
    var listaFechas: any = [];
    var object: any = await this.obtenerListaAsistencias()
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key];
        for (const key1 in element) {
          if (Object.prototype.hasOwnProperty.call(element, key1)) {
            const element1 = element[key1];
            listaFechas.push(element1.fecha)
          }
        }
      }
    }
    return await listaFechas
  }
  async listadoFiltradoAñosGlobales() {
    let aniosTotales = await this.obtenerListaFechasGlobal();
    let Aniosfiltrados = aniosTotales.map((e: string) => {
      return this.obtenerAño(e)
    }).filter((Valor: any, IndiceActual: any, Arreglo: any) => Arreglo.indexOf(Valor) === IndiceActual);
    return Aniosfiltrados
  }
  obtenerAño(dateString: string) {
    var dateAux: Date = new Date(dateString);
    return dateAux.getFullYear()
  }
}
