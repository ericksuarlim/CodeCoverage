import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/auth";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authStateChanged = new Subject<boolean>();

  constructor(public router: Router) { }

  async initializeListener() {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().onAuthStateChanged(() => {
      this.authStateChanged.next(true);
    });
  }

  async login(email: any, password: any) {
    await firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(error => {

      });
  }

  async logout() {
    await firebase.auth().signOut();
    this.router.navigate([""])
  }

  public isLoggedIn() {

    const user = firebase.auth().currentUser;
    return (Boolean(user) || this.router.url.includes("cambiar-clave"));
  }
  async crearCuenta(email: any, password: any) {
    await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;

      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  }
}
