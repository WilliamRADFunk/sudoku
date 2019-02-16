import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidepanelBoardComponent } from './sidepanel-board.component';

describe('SidepanelBoardComponent', () => {
  let component: SidepanelBoardComponent;
  let fixture: ComponentFixture<SidepanelBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidepanelBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidepanelBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
