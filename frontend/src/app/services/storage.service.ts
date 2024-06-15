import { Injectable } from '@angular/core';
import { UserResponse } from '../model/user-response';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // Metoda do zapisywania danych użytkownika w localStorage
  safeUser(user: UserResponse){
    // Ustawienie wartości dla klucza "user" w przeglądarce za pomocą interfejsu localStorage
    localStorage.setItem("user", JSON.stringify(user));
  }

  // Metoda do usuwania danych użytkownika z localStorage
  clearUser(){
    localStorage.removeItem('user');
  }

  // Metoda do sprawdzania, czy użytkownik jest zalogowany
  isUserLoggedIn(): boolean{
    return localStorage.getItem('user') != null; // Sprawdzenie czy klucz user istnieje w localStorage
  }

  // Metoda do sprawdzania czy użytkownik jest administratorem
  isAdmin(): boolean{
    if(!this.isUserLoggedIn())
      return false;

    // Pobranie danych użytkownika z localStorage
    const user = JSON.parse(localStorage.getItem('user')!) as UserResponse;

    if(this.isUserLoggedIn()){
      // Sprawdzenie czy użytkownik ma rolę ROLE_ADMIN
      return user.roles.filter(role => role.name == "ROLE_ADMIN").length > 0;
    }
    return false;
  }
}
