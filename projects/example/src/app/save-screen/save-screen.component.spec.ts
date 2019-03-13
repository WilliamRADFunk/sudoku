import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveScreenComponent } from './save-screen.component';
import { SudokuModule, BoardOverlordService } from 'sudoku';
import { FormsModule } from '@angular/forms';

describe('SaveScreenComponent', () => {
  let component: SaveScreenComponent;
  let fixture: ComponentFixture<SaveScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        SudokuModule
      ],
      declarations: [ SaveScreenComponent ],
      providers: [ BoardOverlordService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
