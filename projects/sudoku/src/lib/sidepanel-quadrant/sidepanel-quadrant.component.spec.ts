import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidepanelQuadrantComponent } from './sidepanel-quadrant.component';

describe('SidepanelQuadrantComponent', () => {
  let component: SidepanelQuadrantComponent;
  let fixture: ComponentFixture<SidepanelQuadrantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidepanelQuadrantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidepanelQuadrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
