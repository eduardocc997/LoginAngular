import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apikey = 'AIzaSyAMyhX3TeFLTpDXiOI7dl0mdiCEgNDngII';

  userToken: string;
  //Crear Usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  
  //Login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  constructor( private http : HttpClient) {
    this.leerToken();
  }

  logOut(){
    localStorage.removeItem('token');
  }
  logIn( usuario: UsuarioModel){
    const authData = {
      ...usuario, //Esta forma envia todo lo que tiene el modelo usuario (nombre, email y password)
      returnSecureToken: true
    };
    
    return this.http.post(
    `${this.url}/accounts:signInWithPassword?key=${this.apikey}`,
    authData
    ).pipe(
      map( resp =>{
        this.guardarToken(resp['idToken']);
        return resp;
      })
    );
  }
  nuevoUsuario(usuario: UsuarioModel){
    //---- Formas de enviar los datos -------
    //Esta es la forma normal de enviar los datos
    // const authData = {
    //   email: usuario.email,
    //   password: usuario.password,
    //   returnSecureToken: true
    // };
    //Esta forma envia lo del modelo mas otras caractiristicas que queramos agregar
    const authData = {
      ...usuario, //Esta forma envia todo lo que tiene el modelo usuario (nombre, email y password)
      returnSecureToken: true
    };
    
    return this.http.post(
    `${this.url}/accounts:signUp?key=${this.apikey}`,
    authData
    ).pipe(
      map( resp =>{
        this.guardarToken(resp['idToken']);
        return resp;
      })
    );
  }

  private guardarToken( idToken: string){
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy  = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString())
  }
  
  leerToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    } else{
      this.userToken = '';
    }

    return this.userToken;
  }

  estaAutenticado(): boolean{
    if(this.userToken.length < 2){
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if(expiraDate > new Date()){
      return true;
    } else{
      return false;
    }

    return this.userToken.length > 2;
  }

}
