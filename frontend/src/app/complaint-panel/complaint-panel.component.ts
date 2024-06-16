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
    serviceId: null as number | null,
    description: ''
  };
  editingComplaint: ComplaintResponse | null = null;
  statuses = ['ACCEPTED', 'DENIED', 'ONGOING'];
  isAdminOrService$ = new BehaviorSubject<boolean>(false);

  constructor(
    private complaintService: ComplaintserviceService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getComplaints();
    this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_SERVICE']).subscribe(isAdminOrService => {
      this.isAdminOrService$.next(isAdminOrService);
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
        this.complaints.push(data);
        this.newComplaint.serviceId = null;
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
    if (this.editingComplaint) {
      this.complaintService.updateComplaintStatus(this.editingComplaint.id, this.editingComplaint.status)
        .subscribe(updatedComplaint => {
          const index = this.complaints.findIndex(c => c.id === updatedComplaint.id);
          if (index !== -1) {
            this.complaints[index] = updatedComplaint;
          }
          this.cancelEdit();
        });
    }
  }

  onStatusClick(complaint: ComplaintResponse): void {
    if (this.isAdminOrService$.value) {
      this.editStatus(complaint);
    }
  }
}
