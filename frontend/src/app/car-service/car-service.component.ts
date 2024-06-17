import { Component, OnInit } from '@angular/core';
import { CarserviceService } from "../services/carservice.service";
import { CarServiceRequest } from "../model/carService/car-service-request";

@Component({
  selector: 'app-car-service',
  templateUrl: './car-service.component.html',
  styleUrls: ['./car-service.component.scss']
})
export class CarServiceComponent implements OnInit {
  carServiceRequest: CarServiceRequest = new CarServiceRequest(0, '', 0);
  carServices: CarServiceRequest[] = []; // Tablica przechowująca wszystkie usługi
  editingServiceId: number | null = null; // ID usługi, która jest aktualnie edytowana
  editedService: CarServiceRequest = new CarServiceRequest(0, '', 0);

  constructor(private carserviceService: CarserviceService) { }

  ngOnInit() {
    this.loadCarServices(); // Ładowanie wszystkich usług przy inicjalizacji komponentu
  }

  loadCarServices() {
    this.carserviceService.getAllCarServices().subscribe({
      next: response => {
        this.carServices = response;
      }
    });
  }

  addCarService() {
    if (this.carServiceRequest.name && this.carServiceRequest.price !== null) {
      this.carserviceService.addCarService(this.carServiceRequest).subscribe(response => {
        this.carServices.push(response); // Dodanie nowej usługi do tablicy
        this.carServiceRequest = new CarServiceRequest(0, '', 0); // Resetowanie formularza
      });
    }
  }

  editService(service: CarServiceRequest) {
    this.editingServiceId = service.id;
    this.editedService = { ...service };
  }

  cancelEdit() {
    this.editingServiceId = null;
    this.editedService = new CarServiceRequest(0, '', 0);
  }

  saveService() {
    if (this.editedService && this.editingServiceId !== null) {
      // Sprawdza czy nazwa usługi jest ustawiona oraz cena nie jest null
      if (this.editedService.name && this.editedService.price !== null) {
        // Wywołuje metodę aktualizacji usługi serwisowej
        this.carserviceService.updateCarService(this.editedService.id, this.editedService).subscribe(response => {
          // Znajduje indeks usługi w tablicy 'carServices' na podstawie ID edytowanej usługi
          const index = this.carServices.findIndex(service => service.id === this.editingServiceId);
          if (index !== -1) {
            this.carServices[index] = response; // Aktualizacja usługi w tablicy
          }
          this.cancelEdit();
        });
      }
    }
  }

  deleteService(id: number) {
    this.carserviceService.deleteCarService(id).subscribe(() => {
      this.carServices = this.carServices.filter(service => service.id !== id);
    });
  }
}
