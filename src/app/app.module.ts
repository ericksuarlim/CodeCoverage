import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { FormEstudiantesComponent } from './forms/form-estudiantes/form-estudiantes.component';
import { FormsModule } from '@angular/forms';
import { EstadosComponent } from './components/estados/estados.component';
import { FormEstadosComponent } from './forms/form-estados/form-estados.component';
import { ApoderadosComponent } from './components/apoderados/apoderados.component';
import { FormApoderadosComponent } from './forms/form-apoderados/form-apoderados.component';
import { ProfesorasComponent } from './components/profesoras/profesoras.component';
import { FormProfesorasComponent } from './forms/form-profesoras/form-profesoras.component';
import { DiagnosticosComponent } from './components/diagnosticos/diagnosticos.component';
import { FormDiagnosticosComponent } from './forms/form-diagnosticos/form-diagnosticos.component';
import { DeleteModalComponent } from './shared/delete-modal/delete-modal.component';
import { DetallesProfesoraComponent } from './details/detalles-profesora/detalles-profesora.component';
import { DetallesApoderadoComponent } from './details/detalles-apoderado/detalles-apoderado.component';
import { DetallesEstudianteComponent } from './details/detalles-estudiante/detalles-estudiante.component';
import { SuccessModalComponent } from './shared/success-modal/success-modal.component';
import { FailureModalComponent } from './shared/failure-modal/failure-modal.component';

import { FormSesionesComponent } from './forms/form-sesiones/form-sesiones.component';
import { DetallesSesionComponent } from './details/detalles-sesion/detalles-sesion.component';
import { LoginComponent } from './components/login/login.component';
import { ChartsModule } from 'ng2-charts';
import { GraphicEstudiantesComponent } from './graphics/graphic-estudiantes/graphic-estudiantes.component';
import { GraphicSesionesComponent } from './graphics/graphic-sesiones/graphic-sesiones.component';
import { TratamientosComponent } from './components/tratamientos/tratamientos.component';
import { FormTratamientosComponent } from './forms/form-tratamientos/form-tratamientos.component';
import { ResetPasswordModalComponent } from './shared/reset-password-modal/reset-password-modal.component';
import { ResetPasswordSuccessModalComponent } from './shared/reset-password-success-modal/reset-password-success-modal.component';
import { CambiarClaveComponent } from './components/cambiar-clave/cambiar-clave.component';
import { CuentasComponent } from './components/cuentas/cuentas.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    EstudiantesComponent,
    FormEstudiantesComponent,
    EstadosComponent,
    FormEstadosComponent,
    ApoderadosComponent,
    FormApoderadosComponent,
    ProfesorasComponent,
    FormProfesorasComponent,
    DiagnosticosComponent,
    FormDiagnosticosComponent,
    DeleteModalComponent,
    DetallesProfesoraComponent,
    DetallesApoderadoComponent,
    DetallesEstudianteComponent,
    SuccessModalComponent,
    FailureModalComponent,       
    FormSesionesComponent,
    DetallesSesionComponent,
    LoginComponent,
    GraphicEstudiantesComponent,
    GraphicSesionesComponent,
    TratamientosComponent,
    FormTratamientosComponent,
    ResetPasswordModalComponent,
    ResetPasswordSuccessModalComponent,
    CambiarClaveComponent,    
    CuentasComponent, 
    HomeComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    ChartsModule
  ],

  entryComponents: [
    DeleteModalComponent,
    SuccessModalComponent,
    FailureModalComponent,
    ResetPasswordModalComponent,
    ResetPasswordSuccessModalComponent
  ],
   providers: [FormEstudiantesComponent, HomeComponent, AppComponent, ResetPasswordSuccessModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
