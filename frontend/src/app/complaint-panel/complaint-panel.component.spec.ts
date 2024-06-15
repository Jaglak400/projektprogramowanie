import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintPanelComponent } from './complaint-panel.component';

describe('ComplaintPanelComponent', () => {
  let component: ComplaintPanelComponent;
  let fixture: ComponentFixture<ComplaintPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComplaintPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComplaintPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
