import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportSingleFenComponent } from './import-single-fen.component';

describe('ImportSingleFenComponent', () => {
  let component: ImportSingleFenComponent;
  let fixture: ComponentFixture<ImportSingleFenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSingleFenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSingleFenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
