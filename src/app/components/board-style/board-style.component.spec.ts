import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardStyleComponent } from './board-style.component';

describe('BoardStyleComponent', () => {
  let component: BoardStyleComponent;
  let fixture: ComponentFixture<BoardStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardStyleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
