import { Component, inject } from '@angular/core';
import { ClientService } from '../services/client.service';
import { ServiceResponse } from '../model/service/service-response';
import { ServicePartResponse } from '../model/part/service-part-response';
import {jsPDF} from "jspdf";
import {CarServiceResponse} from "../model/carService/car-service-response";
import { ComplaintResponse } from '../model/complaint-response';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from '../services/login.service';
import { ComplaintService } from '../services/complaint.service';
@Component({
  selector: 'app-client-panel',
  templateUrl: './client-panel.component.html',
  styleUrl: './client-panel.component.scss'
})
export class ClientPanelComponent {

  constructor(private clientService: ClientService, private loginService: LoginService, private complaintService: ComplaintService){
    // Pobieranie usług klienta przy inicjalizacji komponentu
    clientService.getClientServices().subscribe({
      next: res => {
        this.clientServices = res;
      }
    });
    this.getComplaints(); // Pobranie wszystkich reklamacji przy inicjalizacji komponentu
    this.loginService.hasAnyRole(['ROLE_ADMIN', 'ROLE_SERVICE']).subscribe(isAdminOrService => {
      this.isAdminOrService$.next(isAdminOrService); // Sprawdzenie czy użytkownik ma rolę admina lub serwisanta
    });
  }

  clientServices: ServiceResponse[] = [];
  complaints: ComplaintResponse[] = [];
  newComplaint = {
    serviceId: null as number | null, // Identyfikator usługi dla nowej reklamacji
    description: ''
  };
  editingComplaint: ComplaintResponse | null = null;
  statuses = ['ACCEPTED', 'DENIED', 'ONGOING'];
  isAdminOrService$ = new BehaviorSubject<boolean>(false); 


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

  async generatePDF(service: ServiceResponse) {
    const doc = new jsPDF({
      format: "a4"
    });

    const readLocalFileAsBinary = (filePath: string) => {
      // Zwraca nową obietnicę (Promise) która po zakończeniu zwróci łańcuch znaków
      return new Promise<string>((resolve, reject) => {
        fetch(filePath)
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => {
            // Zmienia arrayBuffer na łańcuch binarny
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

  getComplaints(): void {
    this.complaintService.getPersonalComplaints().subscribe(data => {
      this.complaints = data;
    });
  }

  addComplaint(service: ServiceResponse, description: HTMLTextAreaElement): void {
    this.complaintService.addComplaint(service.id, description.value).subscribe(data => {
      this.complaints.push(data); // Dodanie nowej reklamacji do tablicy reklamacji
      description.value = '';
      this.cancelComplaint(service);
    });
  }

  cancelComplaint(service: ServiceResponse){
    console.log(this.complaints);
    this.currentlyComplaining = this.currentlyComplaining.filter(c => c !== service.id);
    console.log(this.complaints);
  }

  editStatus(complaint: ComplaintResponse): void {
    this.editingComplaint = { ...complaint };
  }

  isEditing(complaint: ComplaintResponse): boolean {
    return this.editingComplaint?.id === complaint.id;
  }

  cancelEdit(): void {
    this.editingComplaint = null;
  }

  updateStatus(): void {
    // Aktualizacja statusu reklamacji
    if (this.editingComplaint) {
      this.complaintService.updateComplaintStatus(this.editingComplaint.id, this.editingComplaint.status)
        .subscribe(updatedComplaint => {
          const index = this.complaints.findIndex(c => c.id === updatedComplaint.id);
          if (index !== -1) {
            this.complaints[index] = updatedComplaint; // Aktualizacja reklamacji w tablicy
          }
          this.cancelEdit();
        });
    }
  }

  // Rozpoczęcie edycji statusu reklamacji po kliknięciu jeśli użytkownik ma odpowiednią rolę
  onStatusClick(complaint: ComplaintResponse): void {
    if (this.isAdminOrService$.value) {
      this.editStatus(complaint);
    }
  }

  currentlyComplaining: number[] = [];

  startComplaining(service: ServiceResponse){
    this.currentlyComplaining.push(service.id);
  }

  isComplaining(service: ServiceResponse): boolean{
    return this.currentlyComplaining.includes(service.id);
  }
}
