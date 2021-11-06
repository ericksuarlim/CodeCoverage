import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { FormEstudiantesComponent } from './forms/form-estudiantes/form-estudiantes.component';
import { EstadosComponent } from './components/estados/estados.component';
import { FormEstadosComponent } from './forms/form-estados/form-estados.component';
import { ApoderadosComponent } from './components/apoderados/apoderados.component';
import { FormApoderadosComponent } from './forms/form-apoderados/form-apoderados.component';
import { ProfesorasComponent } from './components/profesoras/profesoras.component';
import {FormProfesorasComponent} from './forms/form-profesoras/form-profesoras.component'; 
import {DiagnosticosComponent} from './components/diagnosticos/diagnosticos.component'; 
import {FormDiagnosticosComponent} from './forms/form-diagnosticos/form-diagnosticos.component'; 
import {DetallesProfesoraComponent} from './details/detalles-profesora/detalles-profesora.component'; 
import {TratamientosComponent} from './components/tratamientos/tratamientos.component'; 
import {FormTratamientosComponent} from './forms/form-tratamientos/form-tratamientos.component'; 
import {DetallesApoderadoComponent} from './details/detalles-apoderado/detalles-apoderado.component'; 
import {DetallesEstudianteComponent} from './details/detalles-estudiante/detalles-estudiante.component'; 

import { FormSesionesComponent } from './forms/form-sesiones/form-sesiones.component';
import { DetallesSesionComponent } from './details/detalles-sesion/detalles-sesion.component';
import { LoginComponent } from './components/login/login.component';
import { AutenticacionGuard } from './guards/autenticacion.guard';
import {GraphicEstudiantesComponent} from './graphics/graphic-estudiantes/graphic-estudiantes.component';
import {GraphicSesionesComponent} from './graphics/graphic-sesiones/graphic-sesiones.component';
import {CambiarClaveComponent} from './components/cambiar-clave/cambiar-clave.component';
import{CuentasComponent} from './components/cuentas/cuentas.component'
import {HomeComponent} from './home/home.component'



const routes: Routes = [
  {
    path: "lista-estados",
    component: EstadosComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path: "lista-estudiantes",
    component: EstudiantesComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path: "lista-apoderados",
    component: ApoderadosComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path: "lista-profesoras",
    component: ProfesorasComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path: "lista-diagnosticos",
    component: DiagnosticosComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path:"lista-tratamientos",
    component:TratamientosComponent,
    canActivate: [AutenticacionGuard]
  },
  {
    path: "form-estudiantes",
    component: FormEstudiantesComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path: "form-estados",
    component: FormEstadosComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path: "form-apoderados",
    component: FormApoderadosComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path: "form-profesoras",
    component: FormProfesorasComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path: "form-diagnosticos",
    component: FormDiagnosticosComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path: "detalles-profesora/:id",
    component: DetallesProfesoraComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path:"form-tratamientos",
    component:FormTratamientosComponent,
    canActivate: [AutenticacionGuard]
  },
  {
    path: "detalles-apoderado/:id",
    component: DetallesApoderadoComponent,
    canActivate: [AutenticacionGuard]

  },

  {
    path: "detalles-estudiante/:id",
    component: DetallesEstudianteComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path: "form-sesiones",
    component: FormSesionesComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path: "detalles-sesion/:id",
    component: DetallesSesionComponent,
    canActivate: [AutenticacionGuard]

  },
  {
    path: "",
    component: LoginComponent,

  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AutenticacionGuard]
  },

  {
    path:"graphic-estudiantes",
    component:GraphicEstudiantesComponent,
    canActivate: [AutenticacionGuard]
  },
  {
    path:"graphic-sesiones",
    component:GraphicSesionesComponent,
    canActivate: [AutenticacionGuard]
  },
  {
    path:"cambiar-clave",
    component:CambiarClaveComponent,
  },
  {
    path:"crear-cuenta",
    component:CuentasComponent,
    // canActivate: [AutenticacionGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
