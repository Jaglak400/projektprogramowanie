import {Component, OnInit} from '@angular/core';
import {ComplaintserviceService} from "../services/complaintservice.service";
import {ComplaintResponse} from "../model/complaint-response";

@Component({
  selector: 'app-complaint-panel',
  templateUrl: './complaint-panel.component.html',
  styleUrl: './complaint-panel.component.scss'
})
export class ComplaintPanelComponent implements OnInit {
  complaints: ComplaintResponse[] = [];
  newComplaint = {
    serviceId: null as number | null,
    description: ''
  };

  constructor(private complaintService: ComplaintserviceService) { }

  ngOnInit(): void {
    this.getComplaints();
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
}
