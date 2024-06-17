import { Component, OnInit, inject } from '@angular/core';
import { SerwisService } from '../services/serwis.service';
import { ServiceResponse } from '../model/service/service-response';
import { UserService } from '../services/user.service';
import { UserResponse } from '../model/user-response';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { PartsService } from "../services/parts.service";
import { PartResponse } from "../model/part/part-response";
import { ServicePartResponse } from "../model/part/service-part-response";
import { jsPDF } from "jspdf";
import { CarserviceService } from "../services/carservice.service";
import { CarServiceComponent } from "../car-service/car-service.component"
import { CarServiceRequest } from "../model/carService/car-service-request";
import { CarServiceResponse } from  "../model/carService/car-service-response";

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']})
export class ServiceComponent implements OnInit{

  formBuilder: FormBuilder = inject(FormBuilder);
  serwisService: SerwisService = inject(SerwisService);
  userService: UserService = inject(UserService);
  partsService: PartsService = inject(PartsService);
  carServiceService: CarserviceService = inject(CarserviceService);


  statusOptions: string[] = ['UNDERTAKING', 'REJECTED', 'COMPLETED'];

  services!: ServiceResponse[];
  carServices: CarServiceResponse[] = [];
  clients!: UserResponse[];
  serviceMans!: UserResponse[];
  parts!: PartResponse[];
  serviceForm!: FormGroup;


  pickedParts: { partId: number, amount: number }[] = [];

  ngOnInit(): void {
    this.servicesRefresh();
    this.userService.getAllByRole("ROLE_CLIENT").subscribe({
      next: res => {
        this.clients = res;
      }
    });
    this.userService.getAllByRole("ROLE_SERVICE").subscribe({
      next: res => {
        this.serviceMans = res;
      }
    });
    this.partsService.getAll().subscribe({
      next: res => {
        this.parts = res.sort((a, b) => a.id - b.id);
      }
    });
    this.carServiceService.getAll().subscribe({
      next: res => {
        this.carServices = res;
      }
    });
    // Inicjalizacja formularza usługi
    this.serviceForm = this.formBuilder.group({
      description: [``],
      client: [``],
      serviceMan: [``],
      carService: [[]]
    });
    // this.serwisService.getCarServices().subscribe((data: CarServiceResponse[]) => {
    //   this.carServices = data;
    // });
  }

  // Odświeżanie listy części
  partsRefresh(){
    this.partsService.getAll().subscribe({
      next: res => {
        this.parts = res.sort((a, b) => a.id - b.id);
        this.parts = res;
      }
    });
  }

  // Odświeżanie listy usług
  servicesRefresh() {
    this.serwisService.getAll().subscribe({
      next: res => {
        this.services = res.map(service => {
          // Sortowanie części usługi według id części
          service.serviceParts.sort((a, b) => a.part.id - b.part.id);

          this.services = res;
          // Ustawienie domyślnych wartości dla każdej usługi
          this.services.forEach(service => {
            service.editingStatus = false; // Zmienna informująca, czy usługa jest w stanie edycji
            service.editing = false; // Flaga określająca czy usługa jest edytowana
          });
          return service;
        });
        // Nie potrzebne ale była szansa że sie zjebie
        this.services.forEach(service => service.editingStatus = false);
      }
    });
  }

  // Sprawdzanie czy część jest zaznaczona w checkboxie
  isPartChecked(part: PartResponse): boolean{
    // Jeśli długość wynikowej tablicy jest większa od 0 to część jest zaznaczona
    return this.pickedParts.filter(pp => pp.partId === part.id).length > 0
  }

  // Sprawdzanie czy część jest zaznaczona w trybie edycji
  isPartCheckedEdit(service: ServiceResponse, part: PartResponse): boolean {
    // Jeśli długość wynikowej tablicy jest większa od 0 to część jest zaznaczona w edytowanej usłudze
    return service.serviceParts.filter(pp => pp.part.id === part.id).length > 0;
  }

  // Przełączanie trybu edycji statusu
  toggleStatusEdit(service: any) {
    service.editingStatus = !service.editingStatus;
  }

  // Wybieranie statusu dla usługi
  selectStatus(service: any, status: string) {
    this.setStatus(service.id, status);
  }

  // Ustawianie statusu dla usługi
  setStatus(serviceId: number, status: string) {
    this.serwisService.setStatus(serviceId, status).subscribe(() => {
      this.servicesRefresh();
    });
  }

  // Usuwanie usługi przez ID
  deleteService(serviceId: number) {
    this.serwisService.delete(serviceId).subscribe(() => {
      this.servicesRefresh();
    });
  }

  // Przełączanie trybu edycji dla usługi
  toggleEdit(service: ServiceResponse) {
    service.editing = !service.editing;
  }

  // Zapisywanie edytowanych szczegółów usługi
  saveEdit(service: ServiceResponse) {
    // Ustawia nowy status dla usługi za pomocą serwisService
    this.serwisService.setStatus(service.id, service.status).subscribe(() => {
      this.servicesRefresh();
    });
    // Przypisuje części do usługi za pomocą serwisService
    this.serwisService.assignPartsToService(service.id, service.serviceParts.map(sp => ({ partId: sp.part.id, amount: sp.count }))).subscribe(() => {
      this.servicesRefresh();
    });
    service.editing = false;
  }

  // Anulowanie trybu edycji dla usługi
  cancelEdit(service: ServiceResponse) {
    service.editing = false;
  }

  // Ręczne zarządzanie zaznaczeniem części
  async onPartChangeManual(event: any, service: ServiceResponse, part: PartResponse) {
    if (event.target.checked) {
      // Pobieranie informacji o części z bazy danych za pomocą partsService
      const partInDb = await this.partsService.get(part.id).toPromise();

      // Jeśli część nie została znaleziona w bazie danych zakończ funkcję
      if (partInDb === undefined) {
        return;
      }

      // Sprawdzanie, czy część jest dostępna na stanie
      if (partInDb.inStock > 0) {
        service.serviceParts.push({
          part: part, count: 1,
          id: 0
        });
      } else {
        alert("Brak części na stanie");
        event.target.checked = false;
      }
    } else {
      // Usunięcie części z listy części usługi jeśli checkbox jest odznaczony
      service.serviceParts = service.serviceParts.filter(sp => sp.part.id !== part.id);
    }
  }

  // Ręczne zarządzanie ilością części
  // Nie działa poprawnie i huj
  async onPartAmountChangeManual(servicePart: ServicePartResponse, event: any) {
    console.log("Service Part Before:", servicePart);
    // Pobranie nowej wartości ilości części z pola wejściowego
    const newAmount = Number.parseInt(event.target.value);
    console.log("New Amount:", newAmount);

    // Sprawdzenie czy nowa ilość jest mniejsza niż 1 lub nie jest liczbą
    if (newAmount < 1 || isNaN(newAmount)) {
      // Ustawienie wartości pola wejściowego na 1 jeśli nowa ilość jest mniejsza niż 1 lub nie jest liczbą
      event.target.value = "1";
      return;
    }

    // Obliczenie różnicy między nową a obecną ilością części
    const difference = newAmount - servicePart.count;
    if (difference === 0) {
      return;
    }

    const partInDb = await this.partsService.get(servicePart.part.id).toPromise();
    if (partInDb === undefined) {
      // Jeśli część nie została znaleziona w bazie danych zakończ funkcję
      return;
    }

    // Sprawdzenie, czy w magazynie jest wystarczająca ilość części
    if (difference > partInDb.inStock) {
      alert("Niewystarczająca ilość części w magazynie.");
      // Przywrócenie poprzedniej wartości pola wejściowego
      event.target.value = (servicePart.count).toString();
      return;
    }

    // Przywróć poprzednią ilość części w magazynie
    partInDb.inStock += servicePart.count;

    // Odejmij nową ilość części z magazynu
    partInDb.inStock -= newAmount;

    // Zaktualizuj ilość części w usłudze
    servicePart.count = newAmount;

    // Zapisanie zaktualizowanych informacji o części w bazie danych
    await this.partsService.updatePart(partInDb.id, partInDb).toPromise();
  }

  // Obsługa zmiany statusu checkboxa
  onCheckboxChange(event: any) {
    const selectedCarServices = this.serviceForm?.value.carService || [];

    // Dodanie lub usunięcie wartości z listy wybranych usług w zależności od stanu checkboxa
    if (event.target.checked) {
      selectedCarServices.push(event.target.value); // Dodanie wartości do tablicy
    } else {
      const index = selectedCarServices.indexOf(event.target.value);
      if (index !== -1) {
        selectedCarServices.splice(index, 1); // Usunięcie wartości z tablicy
      }
    }
    // Ustawienie zaktualizowanej listy wybranych usług samochodowych z powrotem do wartości formularza
    this.serviceForm?.get('carService')?.setValue(selectedCarServices);
  }

  // Dodawanie nowej usługi
  addService() {
    const formData = {
      desc: this.serviceForm.value.description,
      clientId: this.serviceForm.value.client,
      serviceManId: this.serviceForm.value.serviceMan,
      carServicesIds: this.serviceForm.value.carService
    };

    this.serwisService.add(formData.desc, formData.clientId).subscribe({
      next: (serviceId: number) => {
        this.serwisService.assignServiceManToService(serviceId, formData.serviceManId).subscribe({
          next: () => {
            this.serwisService.assignPartsToService(serviceId, this.pickedParts).subscribe({
              next: () => {
                this.serwisService.assignCarServicesToService(serviceId, formData.carServicesIds).subscribe({
                  next: () => {
                    this.servicesRefresh();
                    this.partsRefresh();
                    this.pickedParts = [];
                    this.serviceForm.reset();
                  },
                });
              },
            });
          },
        });
      },
      error: err => {console.log(err);}
    });
  }

  // Zarządzanie zaznaczeniem części
  async onPartChange(event: any, partId: number) {
    // Sprawdzenie czy checkbox został zaznaczony
    if (event.target.checked) {
      const partInDb = await this.partsService.get(partId).toPromise();
      if(partInDb === undefined)
        return;
      // Sprawdzenie czy część jest dostępna na stanie
      if(partInDb.inStock > 0){
        this.pickedParts.push({partId: partId, amount: 1});
      }
      else{
        alert("Brak części na stanie");
        // Odznaczenie checkboxa
        event.target.checked = false;
      }

    } else {
      // Usunięcie części z tablicy wybranych części jeśli checkbox nie jest zaznaczony
      this.pickedParts = this.pickedParts.filter(part => part.partId !== partId);
    }
  }

  // Zarządzanie ilością części
  async onPartAmountChange(event: any, partRes: PartResponse){
    // Pobranie wartości wpisanej przez użytkownika w polu ilości części
    let amount = event.target.value;

    // Pobranie informacji o części z bazy danych za pomocą partsService
    const partInDb = await this.partsService.get(partRes.id).toPromise();

    if(partInDb === undefined){
      return;
    }

    if(amount < 1){
      event.target.value = "1";
      amount = 1;
    }

    // Sprawdzenie czy wpisana ilość jest większa od dostępnej ilości na stanie
    if(amount > partInDb.inStock){
      // Ustawienie wartości pola wejściowego na maksymalną dostępną ilość na stanie
      event.target.value = `${partInDb.inStock}`;
      amount = partInDb.inStock;
    }

    this.pickedParts.forEach(part =>{
      if(part.partId === partRes.id){
        part.amount = Number.parseInt(amount);
      }
    });
  }

  // Obliczanie kosztu części w usłudze
  calculatePartCost(serviceParts: ServicePartResponse[]){
    let cost = 0;
    serviceParts.forEach(sPart => {
      cost += sPart.part.price * sPart.count
    });
    return cost;
  }

  // Obliczanie kosztu usługi
  calculateCarServicesCost(carServices: CarServiceResponse[]){
    let cost = 0;
    carServices.forEach(cService => {
      cost += cService.price
    })
    return cost;
  }

  // Generowanie PDF dla usługi
  async generatePDF(service: ServiceResponse) {
    const doc = new jsPDF({
      format: "a4"
    });

    const readLocalFileAsBinary = (filePath: string) => {
      return new Promise<string>((resolve, reject) => {
        fetch(filePath)
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => {
            const binaryString = Array.from(new Uint8Array(arrayBuffer))
              .map(byte => String.fromCharCode(byte))
              .join(''); // Łączy wszystkie znaki w jeden łańcuch
            // Zamienia łańcuch binarny na Base64 i rozwiąż obietnicę
            resolve(btoa(binaryString));
          })
          .catch(reject);
      });
    }

    // Obliczanie kosztów
    const totalPartsCost = this.calculatePartCost(service.serviceParts);
    const totalServicesCost = this.calculateCarServicesCost(service.carServices);
    const totalCost = totalPartsCost + totalServicesCost;

    // Wczytywanie niestandardowej czcionki która obsługuje UTF8
    let myFont = await readLocalFileAsBinary("../assets/fonts/ARIAL.TTF");
    doc.addFileToVFS("MyFont.ttf", myFont);
    doc.addFont("MyFont.ttf", "MyFont", "normal");
    doc.setFont("MyFont");
    doc.setFontSize(12);

    const addRow = (y: number, label: string, value: string | number) => {
      doc.text(label, 15, y);
      doc.text(value.toString(), 100, y);
    }

    const addTitle = (titleText: string) => {
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80); // Dark Blue
      doc.text(titleText, 105, 20, { align: "center" });
    }

    let yPos = 40;

    addTitle('Faktura VAT');

    yPos += 20;
    addRow(yPos, 'ID Usługi:', service.id);
    yPos += 10;
    addRow(yPos, 'Opis:', service.description);
    yPos += 10;
    addRow(yPos, 'Klient:', service.client.name + " " + service.client.surname);
    yPos += 10;
    addRow(yPos, 'Serwisant:', service.serviceMan.name + " " + service.serviceMan.surname);
    yPos += 10;
    addRow(yPos, 'Koszt części:', this.calculatePartCost(service.serviceParts) + ' zł');
    yPos += 10;
    addRow(yPos, 'Koszt usług:', this.calculateCarServicesCost(service.carServices) + ' zł');
    yPos += 10;
    addRow(yPos, 'Całkowity koszt:', totalCost + ' zł');

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Wygenerowano przez: Magazyn', 105, 280, { align: "center" });
    doc.text('Data: ' + new Date().toLocaleDateString(), 105, 287, { align: "center" });

    doc.save(`Faktura_${service.id}.pdf`);
  }
}

