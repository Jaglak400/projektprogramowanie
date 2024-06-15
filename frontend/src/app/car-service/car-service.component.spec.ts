import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarServiceComponent } from './car-service.component';

describe('CarServiceComponent', () => {
  let component: CarServiceComponent;
  let fixture: ComponentFixture<CarServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
