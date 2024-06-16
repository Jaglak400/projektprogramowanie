import { Component } from '@angular/core';
import { ClientService } from '../services/client.service';
import { ServiceResponse } from '../model/service/service-response';
import { ServicePartResponse } from '../model/part/service-part-response';
import {jsPDF} from "jspdf";
import {CarServiceResponse} from "../model/carService/car-service-response";

@Component({
  selector: 'app-client-panel',
  templateUrl: './client-panel.component.html',
  styleUrl: './client-panel.component.scss'
})
export class ClientPanelComponent {

  constructor(private clientService: ClientService){
    clientService.getClientServices().subscribe({
      next: res => {
        this.clientServices = res;
      }
    });
  }

  clientServices: ServiceResponse[] = [];


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
      return new Promise<string>((resolve, reject) => {
        fetch(filePath)
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => {
            const binaryString = Array.from(new Uint8Array(arrayBuffer))
              .map(byte => String.fromCharCode(byte))
              .join('');
            resolve(btoa(binaryString));
          })
          .catch(reject);
      });
    }
    const totalPartsCost = this.calculatePartCost(service.serviceParts);
    const totalServicesCost = this.calculateCarServicesCost(service.carServices);
    const totalCost = totalPartsCost + totalServicesCost;

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
