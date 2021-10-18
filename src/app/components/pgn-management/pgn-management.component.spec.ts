import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgnManagementComponent } from './pgn-management.component';

describe('PgnManagementComponent', () => {
  let component: PgnManagementComponent;
  let fixture: ComponentFixture<PgnManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PgnManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PgnManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
