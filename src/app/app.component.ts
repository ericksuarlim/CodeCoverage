import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import "firebase/firestore";
import { AuthenticationService } from './services/authentication.service';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'avanza';
  LogoAvanza: string = "assets/images/Logo_Avanza_Mejorado.png";


  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
  ) { }


  async ngOnInit() {
    let logged;
    await this.initFirebase();
    await this.authenticationService.initializeListener();
    logged = this.authenticationService.isLoggedIn();

  }

  async initFirebase() {
    await firebase.initializeApp(environment.firebaseConfig);
  }

  estaActivo(route: string, route2: string): boolean {
    return (this.router.url.includes(route) || this.router.url.includes(route2));
  }

  noEstaEnGraficos() {
    return this.router.url != '/graphic-estudiantes' && this.router.url != '/graphic-sesiones';

  }

  mostrarNavbar() {
    return this.router.url != '/home' && this.router.url != '/' && this.router.url != '/crear-cuenta' && !this.router.url.includes('/cambiar-clave') && this.noEstaEnGraficos();
  }
  ocultarNavbar() {

    return this.router.url != '/' && !this.router.url.includes('/cambiar-clave') && this.router.url != '/crear-cuenta';
  }

  mostrarNavbarGraficos() {
    return this.router.url == '/graphic-estudiantes' || this.router.url == '/graphic-sesiones';
  }

  enPaginaPrincipal() {
    return this.router.url == '/home'
  }

  logout() {
    return this.authenticationService.logout();
  }
}
