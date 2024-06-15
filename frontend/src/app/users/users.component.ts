import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserResponse } from '../model/user-response';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users!: UserResponse[];
  newUser: any = {
    username: '',
    password: '',
    name: '',
    surname: '',
    roles: []
  };
  availableRoles: string[] = ['ROLE_WAREHOUSE', 'ROLE_SERVICE', 'ROLE_CLIENT', 'ROLE_ADMIN'];

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Sprawdzenie, czy użytkownik jest zalogowany
    if (!this.storageService.isUserLoggedIn()) {
      this.router.navigate(['']);
    }
    // Pobranie wszystkich użytkowników
    this.userService.getAll().subscribe({
      next: res => {
        this.users = res;
      }});
  }

  // Dodawanie nowego użytkownika
  addUser(): void {
    console.log('New user data:', this.newUser);
    this.userService.addUser(this.newUser).subscribe({
      next: () => {
        // Po dodaniu użytkownika ponownie pobierz wszystkich użytkowników
        this.userService.getAll().subscribe({
          next: res => {
            this.users = res;
          }});
      }});
  }

  // Usuwanie użytkownika
  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        // Po usunięciu użytkownika ponownie pobierz wszystkich użytkowników
        this.userService.getAll().subscribe({
          next: res => {
            this.users = res;
          }});
      }});
  }

  // Edycja użytkownika
  editUser(user: any): void {
    this.newUser = { ...user, password: '' };
  }

  // Zapisywanie użytkownika (dodawanie lub aktualizacja)
  saveUser(): void {
    if (this.newUser.id) {
      // Aktualizacja użytkownika jeśli istnieje identyfikator użytkownika
      this.userService.updateUser(this.newUser).subscribe({
        next: () => {
          this.resetNewUser();
          // Po aktualizacji użytkownika, ponownie pobierz wszystkich użytkowników
          this.userService.getAll().subscribe({
            next: res => {
              this.users = res;
            }});
        }});
    } else {
      this.addUser();
    }
  }

  // Resetowanie danych nowego użytkownika
  resetNewUser(): void {
    this.newUser = {
      id: null,
      username: '',
      password: '',
      name: '',
      surname: '',
      roles: []
    };
  }
}
