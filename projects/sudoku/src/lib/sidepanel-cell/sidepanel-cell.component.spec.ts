import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidepanelCellComponent } from './sidepanel-cell.component';

describe('SidepanelCellComponent', () => {
  let component: SidepanelCellComponent;
  let fixture: ComponentFixture<SidepanelCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidepanelCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidepanelCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
