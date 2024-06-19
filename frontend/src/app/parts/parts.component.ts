import { Component, OnInit  } from '@angular/core';
import { PartResponse } from '../model/part/part-response';
import { PartsService } from '../services/parts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PartRequest } from '../model/part/part-request';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import {forkJoin} from "rxjs";

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
      price: [0, Validators.required],
      zl: [false, Validators.required],
      ww: [false, Validators.required],
      wz: [false, Validators.required],
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

  savePart() {
    if (!this.partToEdit) return;

    // Pobieranie identyfikatora edytowanej części
    const partId = this.partToEdit.id;

    // Tworzenie obiektu updatedPart na podstawie danych z formularza edycji części
    const updatedPart = new PartRequest(
      this.editPartForm.value.name,
      this.editPartForm.value.amount,
      this.editPartForm.value.price
    );

    // Tworzenie tablicu dokumentów na podstawie danych z formularza edycji części
    const documents = [
      this.editPartForm.value.zl,
      this.editPartForm.value.ww,
      this.editPartForm.value.wz
    ];

    // Aktualizacja części za pomocą serwisu partsService
    this.partsService.updatePart(partId, updatedPart).subscribe((part: PartResponse) => {
      // Akutalizacja dokumentów
      this.partsService.updatePartDocuments(partId, documents).subscribe((updatedPartWithDocuments: PartResponse) => {
        // Szukanie indeksu zaktualizowanej części w tablicy
        const index = this.parts.findIndex(p => p.id === updatedPartWithDocuments.id);
        // Jeśli znaleziono indeks zastępujemy starą część nową zaktualizowaną w tablicy this.parts
        if (index !== -1) {
          this.parts[index] = updatedPartWithDocuments;
        }
        this.cancelEdit();
      });
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
      price: part.price,
      zl: part.zl,
      ww: part.ww,
      wz: part.wz
    });
  }

  // updatePart(): void {
  //   if (!this.partToEdit) return;
  //
  //   const updatedPart = new PartRequest(
  //     this.editPartForm.value.name,
  //     this.editPartForm.value.amount,
  //     this.editPartForm.value.price
  //   );
  //
  //   // Aktualizacja części w serwisie i zaktualizowanie listy części
  //   this.partsService.updatePart(this.partToEdit.id, updatedPart).subscribe((part: PartResponse) => {
  //     // Szukamy indeks elementu w tablicy 'parts' który ma takie samo id jak zaktualizowany element
  //     const index = this.parts.findIndex(p => p.id === part.id);
  //     if (index !== -1) {
  //       this.parts[index] = part;
  //     }
  //     this.cancelEdit();
  //   });
  // }
  //
  // updatePartDocuments(): void {
  //   if (!this.partToEdit) return;
  //
  //   const documents = [
  //     this.editPartForm.value.zl,
  //     this.editPartForm.value.ww,
  //     this.editPartForm.value.wz
  //   ];
  //
  //   // Update the part documents in the service and update the list of parts
  //   this.partsService.updatePartDocuments(this.partToEdit.id, documents).subscribe((part: PartResponse) => {
  //     // Find the index of the element in the 'parts' array that has the same id as the updated element
  //     const index = this.parts.findIndex(p => p.id === part.id);
  //     if (index !== -1) {
  //       this.parts[index] = part;
  //     }
  //     this.cancelEdit();
  //   });
  // }

  cancelEdit(): void {
    this.partToEdit = null;
    this.editPartForm.reset();
  }

  trackByFn(index: number, item: PartResponse): number {
    // Funkcja trackBy dla optymalizacji wyświetlania listy części
    return item.id;
  }


}
