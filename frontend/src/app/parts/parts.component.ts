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

    this.editPartForm = this.formbuilder.group({
      name: ['', Validators.required],
      amount: [0, Validators.required],
      price: [0, Validators.required]
    });
  }

  ngOnInit(): void {

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
    let name = this.addPartForm.value.name;
    let amount = this.addPartForm.value.amount;
    let price = this.addPartForm.value.price;

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

    this.partsService.updatePart(this.partToEdit.id, updatedPart).subscribe((part: PartResponse) => {
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
    return item.id;
  }

  
}
