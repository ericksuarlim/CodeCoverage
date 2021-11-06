import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltrosService {

  public filtroEstudiantes = {
    sexo: '',
    diagnostico: '',
    estado: '',
    mes: '',
    anio: '',
    numHistorico: '',
    numGestion: '',
    gestionRegistro: ''
  };
  public filtroApoderados = {
    correoElectronico: '',
    celular: '',
    telefono: '',
  };

  constructor() { }
}
