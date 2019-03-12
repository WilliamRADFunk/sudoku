import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveScreenComponent } from './save-screen.component';

describe('SaveScreenComponent', () => {
  let component: SaveScreenComponent;
  let fixture: ComponentFixture<SaveScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveScreenComponent ]
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
