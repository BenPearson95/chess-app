import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFenComponent } from './manage-fen.component';

describe('ManageFenComponent', () => {
  let component: ManageFenComponent;
  let fixture: ComponentFixture<ManageFenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageFenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
