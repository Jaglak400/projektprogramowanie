import { Component, OnInit  } from '@angular/core';
import { PartResponse } from '../model/part/part-response';
import { PartsService } from '../services/parts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PartRequest } from '../model/part/part-request';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss']
})
export class PartsComponent implements OnInit {
  parts: PartResponse[] = [];
  addPartForm: FormGroup;
  editPartForm: FormGroup;
  partToEdit: PartResponse | null = null;

  constructor(private partsService: PartsService, private formbuilder: FormBuilder, private loginService: LoginService,
    private router: Router, private storageService: StorageService
  ) {
    this.addPartForm = formbuilder.group({
      name: [""],
      amount: [""],
      price: [""]
    });
    // Inicjalizacja formularza edycji części z walidacją
    this.editPartForm = this.formbuilder.group({
      name: ['', Validators.required],
      amount: [0, Validators.required],
      price: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    // Sprawdzenie czy użytkownik jest zalogowany jeśli nie to przekierowanie na stronę logowania
    if(!this.storageService.isUserLoggedIn()){
      this.router.navigate(['']);
    }

    this.getParts();
  }

  getParts(): void {
    this.partsService.getAll().subscribe((data: PartResponse[]) => {
      this.parts = data;
    });
  }

  addPart(): void {
    // Pobranie wartości z formularza dodawania części
    let name = this.addPartForm.value.name;
    let amount = this.addPartForm.value.amount;
    let price = this.addPartForm.value.price;

    // Utworzenie nowego żądania dodania części
    let part = new PartRequest(name, amount, price);
    this.partsService.addPart(part).subscribe((part: PartResponse) => {
        this.parts.push(part);
        this.addPartForm.reset();
      }
    );
  }

  deletePart(id: number): void {
    this.partsService.deletePart(id).subscribe(() => {
      this.parts = this.parts.filter(part => part.id !== id);
    });
  }

  editPart(part: PartResponse): void {
    // Przygotowanie formularza edycji na podstawie wybranej części
    this.partToEdit = part;
    this.editPartForm.setValue({
      name: part.name,
      amount: part.inStock,
      price: part.price
    });
  }

  updatePart(): void {
    if (!this.partToEdit) return;

    const updatedPart = new PartRequest(
      this.editPartForm.value.name,
      this.editPartForm.value.amount,
      this.editPartForm.value.price
    );

    // Aktualizacja części w serwisie i zaktualizowanie listy części
    this.partsService.updatePart(this.partToEdit.id, updatedPart).subscribe((part: PartResponse) => {
      // Szukamy indeks elementu w tablicy 'parts' który ma takie samo id jak zaktualizowany element
      const index = this.parts.findIndex(p => p.id === part.id);
      if (index !== -1) {
        this.parts[index] = part;
      }
      this.cancelEdit();
    });
  }

  cancelEdit(): void {
    this.partToEdit = null;
    this.editPartForm.reset();
  }

  trackByFn(index: number, item: PartResponse): number {
    // Funkcja trackBy dla optymalizacji wyświetlania listy części
    return item.id;
  }


}
