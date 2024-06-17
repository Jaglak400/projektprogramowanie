import { Component, OnInit } from '@angular/core';
import { ComplaintserviceService } from '../services/complaintservice.service';
import { ComplaintResponse } from '../model/complaint-response';
import { AuthService } from '../complaint-panel/AuthService';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-complaint-panel',
  templateUrl: './complaint-panel.component.html',
  styleUrls: ['./complaint-panel.component.scss']
})
export class ComplaintPanelComponent implements OnInit {
  complaints: ComplaintResponse[] = [];
  newComplaint = {
    serviceId: null as number | null, // Identyfikator usługi dla nowej reklamacji
    description: ''
  };
  editingComplaint: ComplaintResponse | null = null;
  statuses = ['ACCEPTED', 'DENIED', 'ONGOING'];
  isAdminOrService$ = new BehaviorSubject<boolean>(false); // Observable sprawdzający rolę użytkownika

  constructor(
    private complaintService: ComplaintserviceService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getComplaints(); // Pobranie wszystkich reklamacji przy inicjalizacji komponentu
    this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_SERVICE']).subscribe(isAdminOrService => {
      this.isAdminOrService$.next(isAdminOrService); // Sprawdzenie czy użytkownik ma rolę admina lub serwisanta
    });
  }

  getComplaints(): void {
    this.complaintService.getAllComplaints().subscribe(data => {
      this.complaints = data;
    });
  }

  addComplaint(): void {
    const { serviceId, description } = this.newComplaint;
    if (serviceId !== null) {
      this.complaintService.addComplaint(serviceId, description).subscribe(data => {
        this.complaints.push(data); // Dodanie nowej reklamacji do tablicy reklamacji
        this.newComplaint.serviceId = null; // Resetowanie formularza
        this.newComplaint.description = '';
      });
    }
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
}
